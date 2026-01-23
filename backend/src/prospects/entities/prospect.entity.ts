import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ProspectStatus {
  NOUVEAU = 'nouveau',
  CONTACTE = 'contacte',
  QUALIFIE = 'qualifie',
  CONVERTI = 'converti',
  PERDU = 'perdu'
}

@Entity('prospects')
@Index(['email'], { unique: true })
@Index(['statut'])
@Index(['createdAt'])
export class Prospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100, nullable: true })
  entreprise: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ProspectStatus,
    default: ProspectStatus.NOUVEAU
  })
  statut: ProspectStatus;

  @Column({ type: 'text', nullable: true })
  notes_admin: string;

  @Column({ nullable: true })
  date_contact: Date;

  @Column({ nullable: true, length: 100 })
  contacte_par: string; // Email de l'admin qui a contacté

  @Column({ default: false })
  email_envoye: boolean;

  @Column({ nullable: true })
  date_email: Date;

  @Column({ nullable: true, length: 50, default: 'website' })
  source: string; // 'website', 'referral', etc.

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // Données additionnelles

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthode utilitaire pour obtenir le nom complet avec entreprise
  get displayName(): string {
    return this.entreprise ? `${this.nom} (${this.entreprise})` : this.nom;
  }
}