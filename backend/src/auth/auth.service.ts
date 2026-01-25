import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, AuthProvider } from '../users/entities/user.entity';

interface OAuthUserData {
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  providerId: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async validateOAuthUser(userData: OAuthUserData): Promise<User> {
    // Chercher un utilisateur existant par provider et providerId
    let user = await this.usersService.findByProviderId(userData.provider, userData.providerId);

    if (user) {
      // Utilisateur OAuth existant - mettre à jour les informations si nécessaire
      user = await this.usersService.updateOAuthInfo(user.id, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
      });
    } else {
      // Vérifier s'il existe un utilisateur avec le même email
      const existingUser = await this.usersService.findByEmail(userData.email);
      
      if (existingUser && existingUser.provider === AuthProvider.LOCAL) {
        // Lier le compte local avec OAuth
        await this.usersService.updateOAuthInfo(existingUser.id, {
          firstName: userData.firstName || existingUser.firstName,
          lastName: userData.lastName || existingUser.lastName,
          avatar: userData.avatar,
        });
        user = await this.usersService.findById(existingUser.id);
      } else {
        // Nouvel utilisateur OAuth
        user = await this.usersService.createOAuthUser({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          provider: userData.provider,
          providerId: userData.providerId,
          avatar: userData.avatar,
        });
      }
    }

    // Mettre à jour la dernière connexion
    await this.usersService.updateLastLogin(user.id);

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

