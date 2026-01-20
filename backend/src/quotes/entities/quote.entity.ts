import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { QuoteItem } from './quote-item.entity';

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CONVERTED = 'converted', // Converti en facture
}

@Entity('quotes')
@Index(['quoteNumber'])
@Index(['clientId'])
@Index(['status'])
@Index(['createdAt'])
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  @Index()
  quoteNumber: string;

  @ManyToOne(() => Client, (client) => client.quotes, { eager: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  @Index()
  clientId: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  subtotalAmount: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  discountAmount: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  taxAmount: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.DRAFT,
  })
  @Index()
  status: QuoteStatus;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, type: 'text' })
  terms: string; // Conditions générales

  // Relations
  @OneToMany(() => QuoteItem, (item) => item.quote, { 
    cascade: true,
    eager: false 
  })
  items: QuoteItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateQuoteNumber() {
    if (!this.quoteNumber) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-6);
      this.quoteNumber = `QUO-${year}${month}-${timestamp}`;
    }
  }

  // Méthodes utilitaires
  get isExpired(): boolean {
    return this.validUntil ? new Date() > this.validUntil : false;
  }

  get canBeConverted(): boolean {
    return this.status === QuoteStatus.ACCEPTED;
  }
}

