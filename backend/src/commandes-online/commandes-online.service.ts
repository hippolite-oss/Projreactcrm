import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandeOnline, CommandeOnlineStatus } from './entities/commande-online.entity';
import { CreateCommandeOnlineDto } from './dto/create-commande-online.dto';
import { UpdateCommandeOnlineDto } from './dto/update-commande-online.dto';

@Injectable()
export class CommandesOnlineService {
  constructor(
    @InjectRepository(CommandeOnline)
    private commandeOnlineRepository: Repository<CommandeOnline>,
  ) {}

  async create(createCommandeOnlineDto: CreateCommandeOnlineDto): Promise<{
    success: boolean;
    data: CommandeOnline;
    message: string;
  }> {
    const commande = this.commandeOnlineRepository.create(createCommandeOnlineDto);
    const savedCommande = await this.commandeOnlineRepository.save(commande);
    
    return {
      success: true,
      data: savedCommande,
      message: 'Commande créée avec succès'
    };
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

  async marquerLu(id: number): Promise<CommandeOnline> {
    return this.update(id, { statut: CommandeOnlineStatus.LU });
  }

  async annuler(id: number): Promise<CommandeOnline> {
    return this.update(id, { statut: CommandeOnlineStatus.ANNULE });
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
  }> {
    const [total, nouveau, lu, en_cours, traite, annule] = await Promise.all([
      this.commandeOnlineRepository.count(),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.NOUVEAU } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.LU } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.EN_COURS } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.TRAITE } }),
      this.commandeOnlineRepository.count({ where: { statut: CommandeOnlineStatus.ANNULE } }),
    ]);

    return { total, nouveau, lu, en_cours, traite, annule };
  }
}