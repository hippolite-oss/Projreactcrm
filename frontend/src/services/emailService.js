import emailjs from '@emailjs/browser';

// Configuration EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_lb6z5zo', // À configurer sur emailjs.com
  TEMPLATE_ID: 'template_nnb9b1m', // À configurer sur emailjs.com
  PUBLIC_KEY: 'ps-aYVc3Kclusv86y' // À configurer sur emailjs.com
};

class EmailService {
  constructor() {
    // Initialiser EmailJS avec votre clé publique
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  /**
   * Envoyer un email de confirmation de réception
   */
  async envoyerConfirmationReception(commande) {
    try {
      console.log('📧 Envoi email de confirmation pour:', commande.nom);

      const templateParams = {
        to_email: commande.email,
        to_name: commande.nom,
        from_name: 'CRM System',
        subject: `✅ Confirmation de réception - Commande ${commande.nom}`,
        
        // Données de la commande
        client_nom: commande.nom,
        client_telephone: commande.telephone,
        client_email: commande.email,
        client_ville: commande.ville,
        client_adresse: commande.adresse,
        commande_details: commande.commande,
        commande_notes: commande.notes || 'Aucune note',
        date_commande: new Date(commande.createdAt || commande.date_creation).toLocaleString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        
        // Message personnalisé
        message: `
Bonjour ${commande.nom},

Nous avons bien reçu votre commande et nous vous remercions de votre confiance.

Détails de votre commande :
- Nom : ${commande.nom}
- Téléphone : ${commande.telephone}
- Ville : ${commande.ville}
- Adresse : ${commande.adresse}
- Commande : ${commande.commande}
${commande.notes ? `- Notes : ${commande.notes}` : ''}

Nous traiterons votre demande dans les plus brefs délais et vous recontacterons pour confirmer les détails.

Cordialement,
L'équipe CRM System
        `.trim()
      };

      console.log('📤 Paramètres email:', templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email envoyé avec succès:', result);
      return {
        success: true,
        message: 'Email de confirmation envoyé avec succès',
        result
      };

    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return {
        success: false,
        message: `Erreur lors de l'envoi: ${error.text || error.message}`,
        error
      };
    }
  }

  /**
   * Envoyer un email à un prospect
   */
  async envoyerEmailProspect(prospect, template = 'welcome') {
    try {
      console.log('📧 Envoi email prospect pour:', prospect.nom);

      let subject, message;
      
      // Templates spécifiques pour prospects
      switch (template) {
        case 'welcome':
          subject = `🎯 Merci pour votre intérêt - Démonstration CRM`;
          message = `
Bonjour ${prospect.nom},

Nous avons bien reçu votre demande de démonstration et nous vous remercions de votre intérêt pour notre solution CRM.

📋 Récapitulatif de votre demande :
• Nom : ${prospect.nom}
${prospect.entreprise ? `• Entreprise : ${prospect.entreprise}` : ''}
• Email : ${prospect.email}
${prospect.telephone ? `• Téléphone : ${prospect.telephone}` : ''}
${prospect.message ? `• Votre message : "${prospect.message}"` : ''}

🚀 Prochaines étapes :
Notre équipe commerciale vous contactera dans les 24h pour :
✓ Comprendre vos besoins spécifiques
✓ Organiser une démonstration personnalisée
✓ Vous présenter les fonctionnalités adaptées à votre secteur

💡 En attendant, n'hésitez pas à nous contacter si vous avez des questions.

Cordialement,
L'équipe CRM System
          `.trim();
          break;
          
        case 'demo_planifiee':
          subject = `📅 Démonstration CRM planifiée - Confirmation`;
          message = `
Bonjour ${prospect.nom},

Parfait ! Votre démonstration CRM a été planifiée avec succès.

📅 Détails de votre rendez-vous :
• Date et heure : À confirmer par notre équipe
• Durée : 30-45 minutes
• Format : Visioconférence ou présentiel selon vos préférences

🎯 Au programme de votre démonstration :
✓ Présentation des fonctionnalités principales
✓ Cas d'usage adaptés à votre secteur
✓ Session de questions/réponses
✓ Proposition commerciale personnalisée

📞 Notre expert vous contactera sous 24h pour finaliser les détails.

À très bientôt !
L'équipe CRM System
          `.trim();
          break;

        case 'demo_reussie':
          subject = `🎉 Merci pour votre participation - Suite de votre projet CRM`;
          message = `
Bonjour ${prospect.nom},

Nous vous remercions pour le temps accordé lors de notre démonstration CRM !

✨ Nous espérons que la présentation a répondu à vos attentes et que vous avez pu découvrir comment notre solution peut transformer votre gestion client.

📋 Récapitulatif de votre démonstration :
• Fonctionnalités présentées : Gestion clients, prospects, commandes
• Cas d'usage : Adaptés à votre secteur d'activité
• Bénéfices identifiés : Gain de temps, meilleure organisation, suivi client optimisé

🚀 Prochaines étapes :
Notre équipe commerciale vous fera parvenir :
✓ Une proposition commerciale personnalisée
✓ Un plan de déploiement adapté à vos besoins
✓ Les conditions préférentielles pour votre projet

💬 Des questions ? Notre équipe reste à votre disposition pour tout complément d'information.

Nous avons hâte de vous accompagner dans votre transformation digitale !

Cordialement,
L'équipe CRM System
          `.trim();
          break;

        case 'suivi_commercial':
          subject = `📈 Suivi de votre projet CRM - Proposition personnalisée`;
          message = `
Bonjour ${prospect.nom},

Suite à nos échanges, nous souhaitons faire le point sur l'avancement de votre projet CRM.

📊 Où en sommes-nous ?
• Démonstration réalisée ✓
• Besoins identifiés ✓
• Proposition commerciale envoyée ✓

🎯 Votre projet nous tient à cœur et nous sommes convaincus que notre solution CRM peut apporter une réelle valeur ajoutée à votre entreprise.

💡 Avez-vous eu l'occasion de :
• Consulter notre proposition ?
• Échanger avec votre équipe ?
• Identifier d'éventuelles questions ?

📞 Notre équipe reste disponible pour :
✓ Répondre à vos questions
✓ Ajuster notre proposition
✓ Planifier une nouvelle démonstration si nécessaire
✓ Vous accompagner dans votre décision

N'hésitez pas à nous contacter, nous serions ravis de poursuivre nos échanges !

Cordialement,
L'équipe CRM System
          `.trim();
          break;
          
        default:
          subject = `🎯 Merci pour votre intérêt - CRM System`;
          message = `
Bonjour ${prospect.nom},

Nous vous remercions pour votre intérêt pour notre solution CRM.

Notre équipe vous contactera bientôt pour vous présenter nos services.

Cordialement,
L'équipe CRM System
          `.trim();
      }

      const templateParams = {
        to_email: prospect.email,
        to_name: prospect.nom,
        from_name: 'CRM System - Équipe Commerciale',
        subject: subject,
        
        // Données du prospect adaptées au template commande
        client_nom: prospect.nom,
        client_telephone: prospect.telephone || '',
        client_email: prospect.email,
        client_ville: prospect.entreprise || 'Entreprise non spécifiée',
        client_adresse: `Source: ${prospect.source || 'Site web'}`,
        commande_details: prospect.message || 'Demande de démonstration CRM',
        commande_notes: `Template: ${template} - Prospect qualifié`,
        date_commande: new Date(prospect.createdAt || prospect.created_at).toLocaleString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        
        // Message personnalisé pour prospects
        message: message
      };

      console.log('📤 Paramètres email prospect:', templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email prospect envoyé avec succès:', result);
      return {
        success: true,
        message: 'Email envoyé avec succès au prospect',
        result
      };

    } catch (error) {
      console.error('❌ Erreur envoi email prospect:', error);
      return {
        success: false,
        message: `Erreur lors de l'envoi: ${error.text || error.message}`,
        error
      };
    }
  }

  /**
   * Tester la configuration EmailJS
   */
  async testerConfiguration() {
    try {
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        from_name: 'CRM System',
        subject: 'Test de configuration EmailJS',
        message: 'Ceci est un test de configuration EmailJS.'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        testParams
      );

      return {
        success: true,
        message: 'Configuration EmailJS fonctionnelle',
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de configuration: ${error.text || error.message}`,
        error
      };
    }
  }
}

export default new EmailService();

// Instructions de configuration
export const INSTRUCTIONS_CONFIGURATION = `
📧 Configuration EmailJS requise :

1. Créez un compte sur https://www.emailjs.com/
2. Créez un service email (Gmail recommandé)
3. Créez un template avec les variables suivantes :
   - {{to_email}} : Email du destinataire
   - {{to_name}} : Nom du destinataire
   - {{from_name}} : Nom de l'expéditeur
   - {{subject}} : Sujet de l'email
   - {{message}} : Corps du message
   - {{client_nom}} : Nom du client
   - {{client_telephone}} : Téléphone du client
   - {{commande_details}} : Détails de la commande
   - {{date_commande}} : Date de la commande

4. Récupérez vos clés :
   - SERVICE_ID : ID de votre service
   - TEMPLATE_ID : ID de votre template
   - PUBLIC_KEY : Votre clé publique

5. Mettez à jour la configuration dans ce fichier
`;

console.log(INSTRUCTIONS_CONFIGURATION);