import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  // Méthodes OAuth
  async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { provider: provider as any, providerId }
    });
  }

  async createOAuthUser(userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    provider: string;
    providerId: string;
    avatar?: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      ...userData,
      provider: userData.provider as any, // Cast pour éviter les erreurs TypeScript
      emailVerified: true, // Les comptes OAuth sont considérés comme vérifiés
      isActive: true,
      role: 'user' as any,
    });
    return this.usersRepository.save(user);
  }

  async updateOAuthInfo(userId: number, oauthData: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): Promise<User> {
    await this.usersRepository.update(userId, oauthData);
    return this.findById(userId);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}

