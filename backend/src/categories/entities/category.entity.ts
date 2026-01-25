import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

@Entity('categories')
@Index(['name'])
@Index(['slug'])
@Index(['parentId'])
@Index(['active'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string; // URL-friendly version du nom

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, length: 500 })
  imageUrl: string;

  @Column({ nullable: true, length: 100 })
  icon: string; // Nom de l'icône Lucide

  @Column({ nullable: true, length: 50 })
  color: string; // Couleur pour l'interface

  @Column({ type: 'int', default: 0 })
  sortOrder: number; // Ordre d'affichage

  @Column({ default: true })
  active: boolean;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  // Hiérarchie des catégories
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // Métadonnées pour les templates
  @Column({ type: 'text', nullable: true })
  productTemplate: string; // Template JSON pour les produits de cette catégorie

  @Column({ type: 'text', nullable: true })
  requiredFields: string; // Champs requis pour cette catégorie (JSON)

  @Column({ type: 'text', nullable: true })
  customFields: string; // Champs personnalisés (JSON)

  // SEO et métadonnées
  @Column({ nullable: true, length: 255 })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  keywords: string; // Mots-clés séparés par des virgules

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthodes utilitaires
  get isParent(): boolean {
    return this.parentId === null;
  }

  get level(): number {
    // Calculé côté service pour éviter les requêtes récursives
    return 0;
  }

  get fullPath(): string {
    // Chemin complet de la catégorie (calculé côté service)
    return this.name;
  }

  // Méthode pour générer le slug automatiquement
  generateSlug(): void {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}