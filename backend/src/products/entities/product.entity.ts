import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuoteItem } from '../../quotes/entities/quote-item.entity';
import { InvoiceItem } from '../../invoices/entities/invoice-item.entity';

export enum ProductUnit {
  PIECE = 'piece',
  HOUR = 'hour',
  DAY = 'day',
  METER = 'meter',
  KILOGRAM = 'kilogram',
  LITER = 'liter',
}

@Entity('products')
@Index(['name'])
@Index(['active'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductUnit,
    default: ProductUnit.PIECE,
  })
  unit: ProductUnit;

  @Column({ nullable: true, length: 100 })
  category: string;

  @Column({ nullable: true, length: 50 })
  sku: string; // Code produit

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', nullable: true })
  minStockLevel: number; // Seuil d'alerte stock

  @Column({ default: true })
  active: boolean;

  // Relations
  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.product)
  quoteItems: QuoteItem[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.product)
  invoiceItems: InvoiceItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthode utilitaire pour vérifier le stock faible
  get isLowStock(): boolean {
    return this.minStockLevel ? this.stockQuantity <= this.minStockLevel : false;
  }
}

