import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
}

@Entity('users')
@Index(['email'])
@Index(['provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, select: false, nullable: true }) // nullable pour OAuth
  password: string;

  @Column({ nullable: true, length: 100 })
  firstName: string;

  @Column({ nullable: true, length: 100 })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  // Champs OAuth
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Column({ nullable: true, length: 255 })
  providerId: string; // ID du provider (Google ID, GitHub ID, etc.)

  @Column({ nullable: true, length: 500 })
  avatar: string; // URL de l'avatar

  @Column({ default: false })
  emailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthode utilitaire pour obtenir le nom complet
  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  // Méthode pour vérifier si l'utilisateur utilise OAuth
  get isOAuthUser(): boolean {
    return this.provider !== AuthProvider.LOCAL;
  }
}

