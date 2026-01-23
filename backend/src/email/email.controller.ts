import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Tester la configuration email
   */
  @Get('test-config')
  async testerConfiguration() {
    const result = await this.emailService.verifierConfiguration();
    return {
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Envoyer un email de test
   */
  @Post('test')
  async envoyerEmailTest(@Body() body: { destinataire: string }) {
    const { destinataire } = body;
    
    if (!destinataire) {
      return {
        success: false,
        message: 'Adresse email destinataire requise'
      };
    }

    const success = await this.emailService.envoyerEmailTest(destinataire);
    
    return {
      success,
      message: success 
        ? `Email de test envoyé avec succès à ${destinataire}`
        : 'Erreur lors de l\'envoi de l\'email de test',
      destinataire,
      timestamp: new Date().toISOString()
    };
  }
}