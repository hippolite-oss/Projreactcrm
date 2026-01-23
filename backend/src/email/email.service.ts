import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CommandeOnline } from '../commandes-online/entities/commande-online.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private mailerService: MailerService) {}

  /**
   * Envoyer email de confirmation de réception de commande
   */
  async envoyerConfirmationReception(commande: CommandeOnline): Promise<boolean> {
    try {
      this.logger.log(`📧 Envoi confirmation réception pour commande ${commande.id}`);
      this.logger.log(`📬 Destinataire: ${commande.email}`);
      this.logger.log(`👤 Client: ${commande.nom}`);

      if (!commande.email) {
        this.logger.warn(`⚠️ Pas d'email pour la commande ${commande.id}`);
        return false;
      }

      // Vérifier la configuration SMTP
      this.logger.log(`🔧 Configuration SMTP:`);
      this.logger.log(`   - Host: ${process.env.SMTP_HOST}`);
      this.logger.log(`   - Port: ${process.env.SMTP_PORT}`);
      this.logger.log(`   - User: ${process.env.SMTP_USER}`);
      this.logger.log(`   - From: ${process.env.EMAIL_FROM}`);

      const emailData = {
        to: commande.email,
        subject: `✅ Confirmation de réception - Commande ${commande.nom}`,
        template: './confirmation-reception',
        context: {
          nom: commande.nom,
          telephone: commande.telephone,
          ville: commande.ville,
          adresse: commande.adresse,
          commande: commande.commande,
          notes: commande.notes,
          date: new Date(commande.createdAt).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          annee: new Date().getFullYear()
        },
      };

      this.logger.log(`📤 Tentative d'envoi avec les données:`, JSON.stringify(emailData, null, 2));

      const result = await this.mailerService.sendMail(emailData);
      
      this.logger.log(`📬 Résultat envoi:`, JSON.stringify(result, null, 2));
      this.logger.log(`✅ Email de confirmation envoyé à ${commande.email}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email confirmation: ${error.message}`);
      this.logger.error(`❌ Stack trace: ${error.stack}`);
      
      // Log des détails de l'erreur selon le type
      if (error.code) {
        this.logger.error(`❌ Code d'erreur: ${error.code}`);
      }
      if (error.response) {
        this.logger.error(`❌ Réponse serveur: ${error.response}`);
      }
      if (error.responseCode) {
        this.logger.error(`❌ Code de réponse: ${error.responseCode}`);
      }
      
      return false;
    }
  }

  /**
   * Envoyer email de confirmation de traitement
   */
  async envoyerConfirmationTraitement(commande: CommandeOnline, notesAdmin?: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Envoi confirmation traitement pour commande ${commande.id}`);

      if (!commande.email) {
        this.logger.warn(`⚠️ Pas d'email pour la commande ${commande.id}`);
        return false;
      }

      await this.mailerService.sendMail({
        to: commande.email,
        subject: `🎉 Votre commande a été traitée - ${commande.nom}`,
        template: './confirmation-traitement',
        context: {
          nom: commande.nom,
          telephone: commande.telephone,
          ville: commande.ville,
          adresse: commande.adresse,
          commande: commande.commande,
          notes: commande.notes,
          notesAdmin: notesAdmin,
          dateCommande: new Date(commande.createdAt).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          dateTraitement: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          annee: new Date().getFullYear()
        },
      });

      this.logger.log(`✅ Email de traitement envoyé à ${commande.email}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email traitement: ${error.message}`);
      return false;
    }
  }

  /**
   * Envoyer email de notification d'annulation
   */
  async envoyerNotificationAnnulation(commande: CommandeOnline, raisonAnnulation?: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Envoi notification annulation pour commande ${commande.id}`);

      if (!commande.email) {
        this.logger.warn(`⚠️ Pas d'email pour la commande ${commande.id}`);
        return false;
      }

      await this.mailerService.sendMail({
        to: commande.email,
        subject: `❌ Annulation de votre commande - ${commande.nom}`,
        template: './notification-annulation',
        context: {
          nom: commande.nom,
          telephone: commande.telephone,
          commande: commande.commande,
          raisonAnnulation: raisonAnnulation || 'Aucune raison spécifiée',
          dateCommande: new Date(commande.createdAt).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          dateAnnulation: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          annee: new Date().getFullYear()
        },
      });

      this.logger.log(`✅ Email d'annulation envoyé à ${commande.email}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email annulation: ${error.message}`);
      return false;
    }
  }

  /**
   * Envoyer email de test pour vérifier la configuration
   */
  async envoyerEmailTest(destinataire: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Envoi email de test à ${destinataire}`);

      await this.mailerService.sendMail({
        to: destinataire,
        subject: '🧪 Test de configuration email - CRM System',
        template: './email-test',
        context: {
          destinataire,
          dateTest: new Date().toLocaleString('fr-FR'),
          annee: new Date().getFullYear()
        },
      });

      this.logger.log(`✅ Email de test envoyé avec succès à ${destinataire}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email de test: ${error.message}`);
      return false;
    }
  }

  /**
   * Envoyer email à un prospect (utilise le template de confirmation)
   */
  async envoyerEmailProspect(prospectData: any, template = 'welcome'): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`📧 Envoi email prospect template "${template}" à ${prospectData.email}`);

      if (!prospectData.email) {
        this.logger.warn(`⚠️ Pas d'email pour le prospect`);
        return { success: false, message: 'Email manquant' };
      }

      // Adapter les données du prospect au format du template de commande
      const emailData = {
        to: prospectData.email,
        subject: template === 'welcome' 
          ? `🎯 Merci pour votre intérêt - Démonstration CRM`
          : `📧 Message de notre équipe CRM`,
        template: './confirmation-reception', // Réutiliser le template existant
        context: {
          nom: prospectData.nom,
          telephone: prospectData.telephone || '',
          ville: prospectData.entreprise || 'Non spécifiée',
          adresse: prospectData.source || 'Site web',
          commande: prospectData.message || 'Demande de démonstration CRM',
          notes: `Prospect ${template} - Notre équipe vous contactera bientôt pour organiser une démonstration personnalisée.`,
          date: new Date(prospectData.createdAt || new Date()).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          annee: new Date().getFullYear()
        },
      };

      this.logger.log(`📤 Tentative d'envoi email prospect:`, JSON.stringify(emailData, null, 2));

      const result = await this.mailerService.sendMail(emailData);
      
      this.logger.log(`📬 Résultat envoi prospect:`, JSON.stringify(result, null, 2));
      this.logger.log(`✅ Email prospect envoyé à ${prospectData.email}`);
      
      return { success: true, message: 'Email envoyé avec succès' };
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email prospect: ${error.message}`);
      this.logger.error(`❌ Stack trace: ${error.stack}`);
      
      return { success: false, message: `Erreur: ${error.message}` };
    }
  }

  /**
   * Vérifier la configuration email
   */
  async verifierConfiguration(): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier les variables d'environnement
      const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        const message = `Variables manquantes: ${missingVars.join(', ')}`;
        this.logger.error(`❌ Configuration email incomplète: ${message}`);
        return { success: false, message };
      }

      // Tester la connexion SMTP
      await this.mailerService.sendMail({
        to: process.env.SMTP_USER, // Envoyer à soi-même pour tester
        subject: '🔧 Test de configuration SMTP',
        text: 'Configuration SMTP fonctionnelle !',
      });

      this.logger.log('✅ Configuration email vérifiée avec succès');
      return { success: true, message: 'Configuration email fonctionnelle' };
    } catch (error) {
      this.logger.error(`❌ Erreur vérification configuration: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}