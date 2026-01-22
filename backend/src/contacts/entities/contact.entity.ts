import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('contacts')
@Index(['email'])
@Index(['clientId'])
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ nullable: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPrimary: boolean; // Contact principal du client

  @Column({ nullable: true, type: 'text' })
  notes: string;

  // Relations
  @ManyToOne(() => Client, (client) => client.contacts, { 
    onDelete: 'CASCADE',
    nullable: true 
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ nullable: true })
  clientId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthode utilitaire pour obtenir le nom complet
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

