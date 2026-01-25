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

export enum ProductCategory {
  SMARTPHONES = 'Smartphones & Tablettes',
  COMPUTERS = 'Ordinateurs & Laptops',
  AUDIO = 'Audio & Accessoires',
  TV_SCREENS = 'TV & Écrans',
  APPLIANCES = 'Électroménager',
  COMPONENTS = 'Composants & Pièces',
  CABLES = 'Câbles & Chargeurs',
  GAMING = 'Gaming & Consoles',
}

@Entity('products')
@Index(['name'])
@Index(['active'])
@Index(['category'])
@Index(['brand'])
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

  @Column({ nullable: true, length: 100 })
  subcategory: string; // Sous-catégorie

  @Column({ nullable: true, length: 100 })
  brand: string; // Marque

  @Column({ nullable: true, length: 100 })
  model: string; // Modèle

  @Column({ nullable: true, length: 50 })
  sku: string; // Code produit

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', nullable: true })
  minStockLevel: number; // Seuil d'alerte stock

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  originalPrice: number; // Prix original (pour promotions)

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  isNew: boolean; // Nouveau produit

  @Column({ default: false })
  isPromotion: boolean; // En promotion

  @Column({ nullable: true, length: 500 })
  imageUrl: string; // URL de l'image principale

  @Column({ type: 'text', nullable: true })
  specifications: string; // Spécifications techniques (JSON)

  @Column({ type: 'int', nullable: true })
  warrantyMonths: number; // Garantie en mois

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

  // Méthode pour obtenir le prix effectif (avec promotion)
  get effectivePrice(): number {
    return this.isPromotion && this.originalPrice ? this.price : this.price;
  }

  // Méthode pour calculer le pourcentage de réduction
  get discountPercentage(): number {
    if (this.isPromotion && this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }
}

