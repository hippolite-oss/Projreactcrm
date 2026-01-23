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
@Index(['email_reception_envoye'])
@Index(['email_traitement_envoye'])
@Index(['traite_par'])
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

  // === NOUVEAUX CHAMPS POUR LA GESTION ADMIN ET EMAILS ===

  @Column({ type: 'text', nullable: true })
  notes_admin: string; // Notes ajoutées par l'administrateur lors du traitement

  @Column({ type: 'timestamp', nullable: true })
  date_traitement: Date; // Date à laquelle la commande a été traitée

  @Column({ type: 'varchar', length: 255, nullable: true })
  traite_par: string; // Email de l'admin qui a traité la commande

  @Column({ type: 'boolean', default: false })
  email_reception_envoye: boolean; // Email de confirmation de réception envoyé

  @Column({ type: 'boolean', default: false })
  email_traitement_envoye: boolean; // Email de confirmation de traitement envoyé

  @Column({ type: 'timestamp', nullable: true })
  date_email_reception: Date; // Date d'envoi de l'email de réception

  @Column({ type: 'timestamp', nullable: true })
  date_email_traitement: Date; // Date d'envoi de l'email de traitement

  @Column({ type: 'text', nullable: true })
  raison_annulation: string; // Raison de l'annulation si applicable

  @Column({ type: 'timestamp', nullable: true })
  date_annulation: Date; // Date d'annulation

  @Column({ type: 'varchar', length: 255, nullable: true })
  annule_par: string; // Admin qui a annulé la commande

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}