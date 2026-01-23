import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandeOnline, CommandeOnlineStatus } from './entities/commande-online.entity';
import { CreateCommandeOnlineDto } from './dto/create-commande-online.dto';
import { UpdateCommandeOnlineDto } from './dto/update-commande-online.dto';
import { TraiterCommandeDto, AnnulerCommandeDto } from './dto/traiter-commande.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class CommandesOnlineService {
  private readonly logger = new Logger(CommandesOnlineService.name);

  constructor(
    @InjectRepository(CommandeOnline)
    private commandeOnlineRepository: Repository<CommandeOnline>,
    private emailService: EmailService,
  ) {}

  async create(createCommandeOnlineDto: CreateCommandeOnlineDto): Promise<{
    success: boolean;
    data: CommandeOnline;
    message: string;
  }> {
    try {
      const commande = this.commandeOnlineRepository.create(createCommandeOnlineDto);
      const savedCommande = await this.commandeOnlineRepository.save(commande);
      
      this.logger.log(`✅ Nouvelle commande créée: ID ${savedCommande.id} - ${savedCommande.nom}`);

      // Envoyer email de confirmation de réception automatiquement
      // DÉSACTIVÉ TEMPORAIREMENT - problème avec les templates
      // if (savedCommande.email) {
      //   this.envoyerEmailReceptionAsync(savedCommande.id);
      // }

      return {
        success: true,
        data: savedCommande,
        message: 'Commande créée avec succès'
      };
    } catch (error) {
      this.logger.error(`❌ Erreur création commande: ${error.message}`);
      throw error;
    }
  }

  async findAll(page = 1, limit = 15, search?: string, statut?: string): Promise<{
    success: boolean;
    data: CommandeOnline[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryBuilder = this.commandeOnlineRepository.createQueryBuilder('commande');

    // Filtres
    if (search) {
      queryBuilder.andWhere(
        '(commande.nom ILIKE :search OR commande.telephone ILIKE :search OR commande.email ILIKE :search OR commande.ville ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (statut) {
      queryBuilder.andWhere('commande.statut = :statut', { statut });
    }

    // Pagination
    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .orderBy('commande.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

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
  }

  async findOne(id: number): Promise<CommandeOnline> {
    const commande = await this.commandeOnlineRepository.findOne({ where: { id } });
    if (!commande) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    return commande;
  }

  async update(id: number, updateCommandeOnlineDto: UpdateCommandeOnlineDto): Promise<CommandeOnline> {
    const commande = await this.findOne(id);
    Object.assign(commande, updateCommandeOnlineDto);
    return this.commandeOnlineRepository.save(commande);
  }

  /**
   * Marquer une commande comme lue
   */
  async marquerLu(id: number, adminEmail?: string): Promise<CommandeOnline> {
    this.logger.log(`📖 Marquage commande ${id} comme lue par ${adminEmail}`);
    
    const updateData: Partial<CommandeOnline> = {
      statut: CommandeOnlineStatus.LU,
    };

    if (adminEmail) {
      updateData.traite_par = adminEmail;
    }

    return this.update(id, updateData);
  }

  /**
   * Traiter une commande (marquer comme traitée + envoyer email)
   */
  async traiterCommande(
    id: number, 
    traiterDto: TraiterCommandeDto, 
    adminEmail: string
  ): Promise<{
    success: boolean;
    data: CommandeOnline;
    message: string;
    emailEnvoye: boolean;
  }> {
    try {
      this.logger.log(`⚙️ Traitement commande ${id} par ${adminEmail}`);

      const commande = await this.findOne(id);
      
      // Mettre à jour la commande
      const updateData: Partial<CommandeOnline> = {
        statut: CommandeOnlineStatus.TRAITE,
        notes_admin: traiterDto.notes_admin,
        date_traitement: new Date(),
        traite_par: adminEmail,
      };

      const commandeTraitee = await this.update(id, updateData);

      let emailEnvoye = false;

      // Envoyer email de traitement si demandé et si email disponible
      if (traiterDto.envoyer_email && commandeTraitee.email && !commandeTraitee.email_traitement_envoye) {
        emailEnvoye = await this.emailService.envoyerConfirmationTraitement(
          commandeTraitee, 
          traiterDto.notes_admin
        );

        if (emailEnvoye) {
          await this.update(id, {
            email_traitement_envoye: true,
            date_email_traitement: new Date(),
          });
        }
      }

      this.logger.log(`✅ Commande ${id} traitée avec succès. Email envoyé: ${emailEnvoye}`);

      return {
        success: true,
        data: commandeTraitee,
        message: 'Commande traitée avec succès',
        emailEnvoye
      };
    } catch (error) {
      this.logger.error(`❌ Erreur traitement commande ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Annuler une commande
   */
  async annulerCommande(
    id: number, 
    annulerDto: AnnulerCommandeDto, 
    adminEmail: string
  ): Promise<{
    success: boolean;
    data: CommandeOnline;
    message: string;
    emailEnvoye: boolean;
  }> {
    try {
      this.logger.log(`❌ Annulation commande ${id} par ${adminEmail}`);

      const commande = await this.findOne(id);
      
      // Mettre à jour la commande
      const updateData: Partial<CommandeOnline> = {
        statut: CommandeOnlineStatus.ANNULE,
        raison_annulation: annulerDto.raison_annulation,
        date_annulation: new Date(),
        annule_par: adminEmail,
      };

      const commandeAnnulee = await this.update(id, updateData);

      let emailEnvoye = false;

      // Envoyer email d'annulation si demandé et si email disponible
      if (annulerDto.envoyer_email && commandeAnnulee.email) {
        emailEnvoye = await this.emailService.envoyerNotificationAnnulation(
          commandeAnnulee, 
          annulerDto.raison_annulation
        );
      }

      this.logger.log(`✅ Commande ${id} annulée. Email envoyé: ${emailEnvoye}`);

      return {
        success: true,
        data: commandeAnnulee,
        message: 'Commande annulée',
        emailEnvoye
      };
    } catch (error) {
      this.logger.error(`❌ Erreur annulation commande ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer manuellement l'email de confirmation de réception (version EmailJS frontend)
   */
  async envoyerEmailReception(id: number): Promise<{
    success: boolean;
    message: string;
    commande?: CommandeOnline;
  }> {
    this.logger.log(`🚀 Marquage email réception pour commande ${id} (EmailJS frontend)`);
    
    try {
      const commande = await this.findOne(id);
      this.logger.log(`📋 Commande trouvée: ${commande.nom} - Email: ${commande.email}`);

      if (!commande.email) {
        this.logger.warn(`❌ Pas d'email pour commande ${id}`);
        return {
          success: false,
          message: 'Aucune adresse email disponible pour cette commande'
        };
      }

      if (commande.email_reception_envoye) {
        this.logger.warn(`⚠️ Email déjà envoyé pour commande ${id}`);
        return {
          success: false,
          message: 'L\'email de réception a déjà été envoyé pour cette commande'
        };
      }

      // Marquer comme envoyé - l'envoi réel se fait côté frontend avec EmailJS
      await this.update(id, {
        email_reception_envoye: true,
        date_email_reception: new Date(),
      });

      this.logger.log(`✅ Commande ${id} marquée pour envoi email via EmailJS`);
      
      return {
        success: true,
        message: 'Commande préparée pour envoi email',
        commande: commande // Retourner les données pour le frontend
      };

    } catch (error) {
      this.logger.error(`❌ Erreur préparation email ${id}: ${error.message}`);
      return {
        success: false,
        message: 'Erreur lors de la préparation de l\'email'
      };
    }
  }

  /**
   * Renvoyer l'email de traitement
   */
  async renvoyerEmailTraitement(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const commande = await this.findOne(id);

      if (!commande.email) {
        return {
          success: false,
          message: 'Aucune adresse email disponible pour cette commande'
        };
      }

      if (commande.statut !== CommandeOnlineStatus.TRAITE) {
        return {
          success: false,
          message: 'La commande doit être traitée avant d\'envoyer l\'email de confirmation'
        };
      }

      const emailEnvoye = await this.emailService.envoyerConfirmationTraitement(
        commande, 
        commande.notes_admin
      );

      if (emailEnvoye) {
        await this.update(id, {
          email_traitement_envoye: true,
          date_email_traitement: new Date(),
        });
      }

      return {
        success: emailEnvoye,
        message: emailEnvoye 
          ? 'Email de traitement renvoyé avec succès'
          : 'Erreur lors de l\'envoi de l\'email'
      };
    } catch (error) {
      this.logger.error(`❌ Erreur renvoi email ${id}: ${error.message}`);
      return {
        success: false,
        message: 'Erreur lors du renvoi de l\'email'
      };
    }
  }

  /**
   * Envoyer email de réception de manière asynchrone
   */
  private async envoyerEmailReceptionAsync(commandeId: number): Promise<void> {
    try {
      // Attendre un peu pour que la transaction soit commitée
      setTimeout(async () => {
        const commande = await this.findOne(commandeId);
        
        if (commande.email && !commande.email_reception_envoye) {
          const emailEnvoye = await this.emailService.envoyerConfirmationReception(commande);
          
          if (emailEnvoye) {
            await this.update(commandeId, {
              email_reception_envoye: true,
              date_email_reception: new Date(),
            });
          }
        }
      }, 1000);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email réception async: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    const commande = await this.findOne(id);
    await this.commandeOnlineRepository.remove(commande);
  }

  async getStats(): Promise<{
    total: number;
    nouveau: number;
    lu: number;
    en_cours: number;
    traite: number;
    annule: number;
    emails_envoyes: number;
  }> {
    const [total, nouveau, lu, en_cours, traite, annule, emails_envoyes] = await Promise.all([
      this.commandeOnlineRepository.count(),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.NOUVEAU } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.LU } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.EN_COURS } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.TRAITE } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.ANNULE } }),
      this.commandeOnlineRepository.count({ where: { email_traitement_envoye: true } }),
    ]);

    return { total, nouveau, lu, en_cours, traite, annule, emails_envoyes };
  }
}