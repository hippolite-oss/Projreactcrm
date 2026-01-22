import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum CommandeOnlineStatus {
  NOUVEAU = 'nouveau',
  LU = 'lu',
  EN_COURS = 'en_cours',
  TRAITE = 'traite',
  ANNULE = 'annule',
}

@Entity('commandes_online')
@Index(['statut'])
@Index(['createdAt'])
export class CommandeOnline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 20 })
  telephone: string;

  @Column({ nullable: true, length: 255 })
  email: string;

  @Column({ type: 'text' })
  adresse: string;

  @Column({ length: 100 })
  ville: string;

  @Column({ type: 'text' })
  commande: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: CommandeOnlineStatus,
    default: CommandeOnlineStatus.NOUVEAU,
  })
  statut: CommandeOnlineStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}