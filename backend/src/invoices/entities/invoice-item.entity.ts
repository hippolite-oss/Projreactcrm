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
import { Invoice } from './invoice.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('invoice_items')
@Index(['invoiceId'])
@Index(['productId'])
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  invoiceId: number;

  @ManyToOne(() => Product, (product) => product.invoiceItems, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: number;

  @Column({ length: 255 })
  description: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 4,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  quantity: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  unitPrice: number;

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  discountPercent: number;

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  taxPercent: number;

  @Column({ type: 'int', default: 1 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthodes utilitaires
  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }

  get discountAmount(): number {
    return (this.subtotal * this.discountPercent) / 100;
  }

  get subtotalAfterDiscount(): number {
    return this.subtotal - this.discountAmount;
  }

  get taxAmount(): number {
    return (this.subtotalAfterDiscount * this.taxPercent) / 100;
  }

  get total(): number {
    return this.subtotalAfterDiscount + this.taxAmount;
  }
}