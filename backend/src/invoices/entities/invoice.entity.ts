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
import { InvoiceItem } from './invoice-item.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

@Entity('invoices')
@Index(['invoiceNumber'])
@Index(['clientId'])
@Index(['status'])
@Index(['dueDate'])
@Index(['createdAt'])
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  invoiceNumber: string;

  @ManyToOne(() => Client, (client) => client.invoices, { eager: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
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
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  paidAmount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, type: 'text' })
  terms: string; // Conditions de paiement

  @Column({ nullable: true, length: 100 })
  paymentMethod: string;

  @Column({ nullable: true, length: 255 })
  paymentReference: string;

  // Relations
  @OneToMany(() => InvoiceItem, (item) => item.invoice, { 
    cascade: true,
    eager: false 
  })
  items: InvoiceItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateInvoiceNumber() {
    if (!this.invoiceNumber) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-6);
      this.invoiceNumber = `INV-${year}${month}-${timestamp}`;
    }
  }

  // Méthodes utilitaires
  get remainingAmount(): number {
    return this.totalAmount - this.paidAmount;
  }

  get isOverdue(): boolean {
    return this.dueDate ? new Date() > this.dueDate && this.status !== InvoiceStatus.PAID : false;
  }

  get isFullyPaid(): boolean {
    return this.paidAmount >= this.totalAmount;
  }

  get isPartiallyPaid(): boolean {
    return this.paidAmount > 0 && this.paidAmount < this.totalAmount;
  }
}

