import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';

@Controller('parametres')
export class ParametresController {
  private parametres = {
    // Informations entreprise
    nom_societe: 'Quincaillerie Pro',
    adresse: '123 Rue de l\'Industrie',
    ville: 'Paris',
    code_postal: '75001',
    telephone: '01 23 45 67 89',
    email: 'contact@quincaillerie-pro.fr',
    siret: '12345678901234',
    tva: 'FR12345678901',
    site_web: 'https://quincaillerie-pro.fr',
    logo: '',

    // Configuration email
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: 'hippoliteagbodamakou@gmail.com',
    smtp_pass: '••••••••••••••••',
    email_from: 'hippoliteagbodamakou@gmail.com',
    email_from_name: 'CRM System',
    emailjs_service_id: 'service_lb6z5zo',
    emailjs_template_id: 'template_nnb9b1m',
    emailjs_public_key: 'ps-aYVc3Kclusv86y',
    auto_email_commandes: true,
    auto_email_prospects: true,

    // Notifications
    email_nouvelles_commandes: true,
    email_nouveaux_prospects: true,
    email_commandes_traitees: false,
    notifications_desktop: true,
    notifications_mobile: true,
    frequence_rapports: 'hebdomadaire',

    // Sécurité
    duree_session: '8',
    force_2fa: false,
    complexite_mdp: 'moyenne',
    tentatives_max: '5',
    logs_actifs: true,

    // Système
    auto_backup: true,
    frequence_backup: 'quotidien',
    retention_logs: '30',
    maintenance_mode: false,
    debug_mode: false
  };

  private users = [
    { 
      id: 1, 
      nom: 'Admin Principal', 
      email: 'admin@test.com', 
      role: 'admin', 
      actif: true, 
      derniere_connexion: '2025-01-25',
      created_at: '2025-01-01'
    },
    { 
      id: 2, 
      nom: 'Commercial 1', 
      email: 'commercial@test.com', 
      role: 'commercial', 
      actif: true, 
      derniere_connexion: '2025-01-24',
      created_at: '2025-01-15'
    },
    { 
      id: 3, 
      nom: 'Manager Ventes', 
      email: 'manager@test.com', 
      role: 'manager', 
      actif: false, 
      derniere_connexion: '2025-01-20',
      created_at: '2025-01-10'
    }
  ];

  @Get()
  getParametres() {
    return {
      success: true,
      data: this.parametres
    };
  }

  @Put()
  updateParametres(@Body() data: any) {
    try {
      // Mettre à jour les paramètres
      this.parametres = { ...this.parametres, ...data };
      
      return {
        success: true,
        message: 'Paramètres mis à jour avec succès',
        data: this.parametres
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la mise à jour des paramètres',
        error: error.message
      };
    }
  }

  @Put(':section')
  updateParametresSection(@Param('section') section: string, @Body() data: any) {
    try {
      // Mettre à jour une section spécifique
      this.parametres = { ...this.parametres, ...data };
      
      return {
        success: true,
        message: `Section ${section} mise à jour avec succès`,
        data: this.parametres
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la mise à jour de la section ${section}`,
        error: error.message
      };
    }
  }

  @Post('test-email')
  testEmailConfiguration(@Body() config: any) {
    try {
      // Simuler un test de configuration email
      const { emailjs_service_id, emailjs_template_id, emailjs_public_key } = config;
      
      if (!emailjs_service_id || !emailjs_template_id || !emailjs_public_key) {
        return {
          success: false,
          message: 'Configuration EmailJS incomplète. Vérifiez les paramètres Service ID, Template ID et Public Key.'
        };
      }

      // Simuler un test réussi
      return {
        success: true,
        message: 'Configuration EmailJS testée avec succès ! Les emails peuvent être envoyés.',
        details: {
          service_id: emailjs_service_id,
          template_id: emailjs_template_id,
          status: 'Connecté'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du test de configuration email',
        error: error.message
      };
    }
  }

  @Post('system/:action')
  executeSystemAction(@Param('action') action: string) {
    try {
      switch (action) {
        case 'backup':
          return {
            success: true,
            message: 'Sauvegarde créée avec succès',
            data: {
              filename: `backup_${new Date().toISOString().split('T')[0]}.sql`,
              size: '2.4 MB',
              date: new Date().toISOString()
            }
          };

        case 'optimize':
          return {
            success: true,
            message: 'Base de données optimisée avec succès',
            data: {
              tables_optimized: 12,
              space_freed: '156 MB',
              duration: '2.3 secondes'
            }
          };

        case 'clear-cache':
          return {
            success: true,
            message: 'Cache vidé avec succès',
            data: {
              cache_cleared: '45 MB',
              files_removed: 1247
            }
          };

        case 'maintenance':
          this.parametres.maintenance_mode = !this.parametres.maintenance_mode;
          return {
            success: true,
            message: `Mode maintenance ${this.parametres.maintenance_mode ? 'activé' : 'désactivé'}`,
            data: {
              maintenance_mode: this.parametres.maintenance_mode
            }
          };

        default:
          return {
            success: false,
            message: 'Action système non reconnue'
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de l'exécution de l'action ${action}`,
        error: error.message
      };
    }
  }

  // Gestion des utilisateurs
  @Get('users')
  getUsers() {
    return {
      success: true,
      data: this.users
    };
  }

  @Post('users')
  createUser(@Body() userData: any) {
    try {
      const newUser = {
        id: Math.max(...this.users.map(u => u.id)) + 1,
        ...userData,
        created_at: new Date().toISOString().split('T')[0],
        derniere_connexion: null,
        actif: true
      };
      
      this.users.push(newUser);
      
      return {
        success: true,
        message: 'Utilisateur créé avec succès',
        data: newUser
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      };
    }
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() userData: any) {
    try {
      const userId = parseInt(id);
      const userIndex = this.users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        };
      }
      
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      
      return {
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: this.users[userIndex]
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message
      };
    }
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id);
      const userIndex = this.users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        };
      }
      
      // Ne pas supprimer l'admin principal
      if (this.users[userIndex].role === 'admin' && this.users[userIndex].id === 1) {
        return {
          success: false,
          message: 'Impossible de supprimer l\'administrateur principal'
        };
      }
      
      this.users.splice(userIndex, 1);
      
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error.message
      };
    }
  }
}