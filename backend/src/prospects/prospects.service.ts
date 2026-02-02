import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Prospect, ProspectStatus } from './entities/prospect.entity';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { SendEmailProspectDto } from './dto/send-email-prospect.dto';
import { EmailService } from '../email/email.service';
import { AppLoggerService } from '../common/services/logger.service';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>,
    private emailService: EmailService,
    private logger: AppLoggerService,
  ) {}

  /**
   * Créer un nouveau prospect (endpoint public)
   */
  async create(createProspectDto: CreateProspectDto): Promise<{
    success: boolean;
    data: Prospect;
    message: string;
  }> {
    try {
      this.logger.info(`📝 Nouvelle soumission prospect: ${createProspectDto.nom} - ${createProspectDto.email}`);

      // Vérifier si l'email existe déjà
      const existingProspect = await this.prospectRepository.findOne({
        where: { email: createProspectDto.email }
      });

      if (existingProspect) {
        this.logger.warning(`⚠️ Email déjà existant: ${createProspectDto.email}`);
        throw new ConflictException('Un prospect avec cet email existe déjà. Nous vous contacterons bientôt.');
      }

      // Créer le prospect
      const prospect = this.prospectRepository.create({
        ...createProspectDto,
        source: createProspectDto.source || 'website'
      });

      const savedProspect = await this.prospectRepository.save(prospect);
      this.logger.success(`✅ Prospect créé avec succès: ID ${savedProspect.id}`);

      return {
        success: true,
        data: savedProspect,
        message: 'Votre demande a été enregistrée avec succès. Notre équipe vous contactera bientôt.'
      };
    } catch (error) {
      this.logger.logError(error, {}, { 
        operation: 'create_prospect', 
        prospectData: { nom: createProspectDto.nom, email: createProspectDto.email }
      });
      throw error;
    }
  }

  /**
   * Lister tous les prospects avec pagination et filtres (admin)
   */
  async findAll(
    page = 1, 
    limit = 15, 
    search?: string, 
    statut?: string,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{
    success: boolean;
    data: Prospect[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const queryBuilder = this.prospectRepository.createQueryBuilder('prospect');

      // Filtres de recherche
      if (search) {
        queryBuilder.andWhere(
          '(prospect.nom ILIKE :search OR prospect.entreprise ILIKE :search OR prospect.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Filtre par statut
      if (statut && statut !== 'all') {
        queryBuilder.andWhere('prospect.statut = :statut', { statut });
      }

      // Tri
      queryBuilder.orderBy(`prospect.${sortBy}`, sortOrder);

      // Pagination
      const total = await queryBuilder.getCount();
      const data = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      this.logger.log(`📊 Prospects récupérés: ${data.length}/${total} (page ${page})`);

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`❌ Erreur récupération prospects: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupérer un prospect par ID
   */
  async findOne(id: number): Promise<Prospect> {
    const prospect = await this.prospectRepository.findOne({ where: { id } });
    if (!prospect) {
      throw new NotFoundException(`Prospect avec l'ID ${id} non trouvé`);
    }
    return prospect;
  }

  /**
   * Mettre à jour un prospect
   */
  async update(id: number, updateProspectDto: UpdateProspectDto): Promise<Prospect> {
    const prospect = await this.findOne(id);
    Object.assign(prospect, updateProspectDto);
    
    const updated = await this.prospectRepository.save(prospect);
    this.logger.log(`📝 Prospect ${id} mis à jour`);
    
    return updated;
  }

  /**
   * Marquer un prospect comme contacté
   */
  async marquerContacte(id: number, adminEmail: string): Promise<Prospect> {
    this.logger.log(`📞 Marquage prospect ${id} comme contacté par ${adminEmail}`);
    
    const prospect = await this.findOne(id);
    
    prospect.statut = ProspectStatus.CONTACTE;
    prospect.date_contact = new Date();
    prospect.contacte_par = adminEmail;

    return this.prospectRepository.save(prospect);
  }

  /**
   * Envoyer un email à un prospect
   */
  async sendEmail(
    id: number, 
    emailDto: SendEmailProspectDto,
    adminEmail: string
  ): Promise<{
    success: boolean;
    message: string;
    prospectData?: any;
  }> {
    try {
      const prospect = await this.findOne(id);
      this.logger.log(`📧 Envoi email au prospect ${id} (${prospect.email}) par ${adminEmail}`);

      // Marquer l'email comme envoyé dans la base de données
      prospect.email_envoye = true;
      prospect.date_email = new Date();
      
      // Si c'est le premier contact, changer le statut
      if (prospect.statut === ProspectStatus.NOUVEAU) {
        prospect.statut = ProspectStatus.CONTACTE;
        prospect.date_contact = new Date();
        prospect.contacte_par = adminEmail;
      }

      await this.prospectRepository.save(prospect);
      this.logger.log(`✅ Prospect ${id} mis à jour - email marqué comme envoyé`);

      // Retourner les données du prospect pour que le frontend puisse envoyer l'email via EmailJS
      return {
        success: true,
        message: 'Email envoyé avec succès',
        prospectData: {
          nom: prospect.nom,
          email: prospect.email,
          telephone: prospect.telephone || '',
          entreprise: prospect.entreprise || '',
          message: prospect.message || 'Demande de démonstration CRM',
          createdAt: prospect.createdAt,
          template: emailDto.template || 'welcome'
        }
      };
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email prospect ${id}: ${error.message}`);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }

  /**
   * Supprimer un prospect
   */
  async remove(id: number): Promise<void> {
    const prospect = await this.findOne(id);
    await this.prospectRepository.remove(prospect);
    this.logger.log(`🗑️ Prospect ${id} supprimé`);
  }

  /**
   * Obtenir les statistiques des prospects
   */
  async getStats(): Promise<{
    total: number;
    nouveau: number;
    contacte: number;
    qualifie: number;
    converti: number;
    perdu: number;
    nouveaux_7j: number;
  }> {
    try {
      const [total, nouveau, contacte, qualifie, converti, perdu] = await Promise.all([
        this.prospectRepository.count(),
        this.prospectRepository.count({ where: { statut: ProspectStatus.NOUVEAU } }),
        this.prospectRepository.count({ where: { statut: ProspectStatus.CONTACTE } }),
        this.prospectRepository.count({ where: { statut: ProspectStatus.QUALIFIE } }),
        this.prospectRepository.count({ where: { statut: ProspectStatus.CONVERTI } }),
        this.prospectRepository.count({ where: { statut: ProspectStatus.PERDU } }),
      ]);

      // Nouveaux prospects des 7 derniers jours
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const nouveaux_7j = await this.prospectRepository.count({
        where: {
          createdAt: MoreThan(sevenDaysAgo)
        }
      });

      this.logger.log(`📊 Stats prospects: ${total} total, ${nouveau} nouveaux, ${nouveaux_7j} cette semaine`);

      return { total, nouveau, contacte, qualifie, converti, perdu, nouveaux_7j };
    } catch (error) {
      this.logger.error(`❌ Erreur stats prospects: ${error.message}`);
      throw error;
    }
  }

}