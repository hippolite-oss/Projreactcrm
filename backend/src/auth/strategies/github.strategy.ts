import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/api/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      const { username, displayName, emails, photos } = profile;
      
      // GitHub peut ne pas fournir d'email public
      const email = emails && emails.length > 0 ? emails[0].value : null;
      
      if (!email) {
        throw new Error('Email non disponible depuis GitHub');
      }

      // Séparer le nom complet si disponible
      const nameParts = displayName ? displayName.split(' ') : [username];
      const firstName = nameParts[0] || username;
      const lastName = nameParts.slice(1).join(' ') || '';

      const user = await this.authService.validateOAuthUser({
        email,
        firstName,
        lastName,
        provider: 'github',
        providerId: profile.id,
        avatar: photos[0]?.value,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}