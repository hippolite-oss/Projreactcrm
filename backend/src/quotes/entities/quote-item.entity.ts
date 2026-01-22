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
import { Quote } from './quote.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('quote_items')
@Index(['quoteId'])
@Index(['productId'])
export class QuoteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quoteId' })
  quote: Quote;

  @Column()
  quoteId: number;

  @ManyToOne(() => Product, (product) => product.quoteItems, { nullable: true })
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

  get total(): number {
    return this.subtotal - this.discountAmount;
  }
}