import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Langues disponibles dans l'application
   */
  async getAvailableLanguages() {
    return {
      success: true,
      data: [
        {
          code: 'fr',
          name: 'Français',
          flag: '🇫🇷',
          default: true
        },
        {
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          default: false
        }
      ]
    };
  }

  /**
   * Récupérer les traductions pour une langue donnée
   */
  async getTranslations(lang: string) {
    try {
      const translations = this.getTranslationData(lang);
      
      return {
        success: true,
        language: lang,
        data: translations
      };
    } catch (error) {
      this.logger.error(`Erreur récupération traductions ${lang}:`, error.message);
      return {
        success: false,
        message: `Traductions non disponibles pour la langue: ${lang}`
      };
    }
  }

  /**
   * Mettre à jour la préférence de langue d'un utilisateur
   */
  async updateUserLanguagePreference(language: string, userId?: number) {
    try {
      if (userId) {
        await this.userRepository.update(userId, { 
          // Nous ajouterons le champ language à l'entité User plus tard
          // Pour l'instant, on stocke dans les métadonnées
        });
      }

      return {
        success: true,
        message: `Langue mise à jour: ${language}`,
        language
      };
    } catch (error) {
      this.logger.error(`Erreur mise à jour langue utilisateur:`, error.message);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de la langue'
      };
    }
  }

  /**
   * Récupérer la préférence de langue d'un utilisateur
   */
  async getUserLanguagePreference(userId: number) {
    try {
      // Pour l'instant, retourner français par défaut
      // Plus tard, on récupérera depuis la base de données
      return {
        success: true,
        language: 'fr',
        userId
      };
    } catch (error) {
      this.logger.error(`Erreur récupération langue utilisateur:`, error.message);
      return {
        success: false,
        language: 'fr' // Langue par défaut
      };
    }
  }

  /**
   * Données de traduction complètes (en dur pour commencer)
   */
  private getTranslationData(lang: string) {
    const translations = {
      fr: {
        // ==================== NAVIGATION & SIDEBAR ====================
        dashboard: 'Tableau de Bord',
        clients: 'Clients',
        products: 'Produits',
        quotes: 'Devis',
        invoices: 'Factures',
        orders: 'Commandes',
        contacts: 'Contacts',
        prospects: 'Prospects',
        reports: 'Rapports',
        settings: 'Paramètres',
        categories: 'Catégories',
        onlineOrders: 'Commandes en Ligne',
        
        // ==================== DASHBOARD ====================
        totalClients: 'Total Clients',
        newContacts: 'Nouveaux Contacts',
        conversionRate: 'Taux de Conversion',
        totalRevenue: 'Revenu Total',
        clientEvolution: 'Évolution des Clients',
        clientDistribution: 'Répartition des Clients',
        monthlyGrowth: 'Croissance mensuelle de votre clientèle',
        distributionByStatus: 'Distribution par statut d\'activité',
        activeClients: 'Clients Actifs',
        inactiveClients: 'Clients Inactifs',
        prospectsContacts: 'Prospects/Contacts',
        newClients: 'Nouveaux Clients',
        frequencyAnalysis: 'Analyse fréquentielle mensuelle',
        
        // ==================== ACTIONS COMMUNES ====================
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        import: 'Importer',
        refresh: 'Actualiser',
        view: 'Voir',
        details: 'Détails',
        close: 'Fermer',
        confirm: 'Confirmer',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        
        // ==================== STATUTS ====================
        active: 'Actif',
        inactive: 'Inactif',
        pending: 'En attente',
        completed: 'Terminé',
        cancelled: 'Annulé',
        new: 'Nouveau',
        contacted: 'Contacté',
        qualified: 'Qualifié',
        converted: 'Converti',
        lost: 'Perdu',
        
        // ==================== MESSAGES ====================
        loading: 'Chargement...',
        noData: 'Aucune donnée disponible',
        error: 'Une erreur est survenue',
        success: 'Opération réussie',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        operationSuccess: 'Opération effectuée avec succès',
        operationError: 'Erreur lors de l\'opération',
        dataLoaded: 'Données chargées',
        dataSaved: 'Données sauvegardées',
        
        // ==================== FORMULAIRES ====================
        name: 'Nom',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        city: 'Ville',
        company: 'Entreprise',
        message: 'Message',
        notes: 'Notes',
        date: 'Date',
        amount: 'Montant',
        price: 'Prix',
        quantity: 'Quantité',
        total: 'Total',
        description: 'Description',
        reference: 'Référence',
        category: 'Catégorie',
        
        // ==================== PROSPECTS/CONTACTS ====================
        contactManagement: 'Gestion des demandes de démonstration',
        newProspects: 'Nouveaux',
        convertedProspects: 'Convertis',
        allStatuses: 'Tous statuts',
        emailSent: 'Email envoyé',
        contactProspect: 'Contacter le prospect',
        prospectDetails: 'Détails du prospect',
        sendEmail: 'Envoyer un email',
        markAsContacted: 'Marquer comme contacté',
        markAsQualified: 'Marquer comme qualifié',
        markAsConverted: 'Marquer comme converti',
        markAsLost: 'Marquer comme perdu',
        
        // ==================== CLIENTS ====================
        clientManagement: 'Gestion des clients',
        newClient: 'Nouveau client',
        clientDetails: 'Détails du client',
        clientHistory: 'Historique client',
        addClient: 'Ajouter un client',
        editClient: 'Modifier le client',
        
        // ==================== PRODUITS ====================
        productManagement: 'Gestion des produits',
        newProduct: 'Nouveau produit',
        productDetails: 'Détails du produit',
        addProduct: 'Ajouter un produit',
        editProduct: 'Modifier le produit',
        productName: 'Nom du produit',
        productPrice: 'Prix du produit',
        productCategory: 'Catégorie du produit',
        inStock: 'En stock',
        outOfStock: 'Rupture de stock',
        
        // ==================== COMMANDES ====================
        orderManagement: 'Gestion des commandes',
        newOrder: 'Nouvelle commande',
        orderDetails: 'Détails de la commande',
        orderStatus: 'Statut de la commande',
        processOrder: 'Traiter la commande',
        cancelOrder: 'Annuler la commande',
        orderHistory: 'Historique des commandes',
        
        // ==================== RAPPORTS ====================
        reportManagement: 'Gestion des rapports',
        salesReport: 'Rapport des ventes',
        clientReport: 'Rapport des clients',
        productReport: 'Rapport des produits',
        generateReport: 'Générer un rapport',
        exportPDF: 'Exporter en PDF',
        exportExcel: 'Exporter en Excel',
        exportCSV: 'Exporter en CSV',
        
        // ==================== PARAMÈTRES ====================
        language: 'Langue',
        selectLanguage: 'Sélectionner la langue',
        languageSettings: 'Paramètres de langue',
        applicationLanguage: 'Langue de l\'application',
        myProfile: 'Mon Profil',
        companySettings: 'Paramètres de l\'entreprise',
        userManagement: 'Gestion des utilisateurs',
        emailConfiguration: 'Configuration Email',
        notifications: 'Notifications',
        appearance: 'Apparence',
        security: 'Sécurité',
        system: 'Système',
        
        // ==================== TEMPS ====================
        today: 'Aujourd\'hui',
        yesterday: 'Hier',
        thisWeek: 'Cette semaine',
        thisMonth: 'Ce mois',
        thisYear: 'Cette année',
        lastMonth: 'Le mois dernier',
        lastYear: 'L\'année dernière',
        
        // ==================== PAGINATION ====================
        page: 'Page',
        of: 'sur',
        itemsPerPage: 'Éléments par page',
        showing: 'Affichage de',
        to: 'à',
        results: 'résultats',
        
        // ==================== TABLEAUX ====================
        actions: 'Actions',
        createdAt: 'Créé le',
        updatedAt: 'Modifié le',
        status: 'Statut',
        
        // ==================== INTERFACE ====================
        table: 'Tableau',
        cards: 'Cartes',
        list: 'Liste',
        grid: 'Grille',
        reset: 'Réinitialiser',
        clear: 'Effacer',
        
        // ==================== MOIS ====================
        january: 'Janvier',
        february: 'Février',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Août',
        september: 'Septembre',
        october: 'Octobre',
        november: 'Novembre',
        december: 'Décembre',
        
        // ==================== JOURS ====================
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
      },
      
      en: {
        // ==================== NAVIGATION & SIDEBAR ====================
        dashboard: 'Dashboard',
        clients: 'Clients',
        products: 'Products',
        quotes: 'Quotes',
        invoices: 'Invoices',
        orders: 'Orders',
        contacts: 'Contacts',
        prospects: 'Prospects',
        reports: 'Reports',
        settings: 'Settings',
        categories: 'Categories',
        onlineOrders: 'Online Orders',
        
        // ==================== DASHBOARD ====================
        totalClients: 'Total Clients',
        newContacts: 'New Contacts',
        conversionRate: 'Conversion Rate',
        totalRevenue: 'Total Revenue',
        clientEvolution: 'Client Evolution',
        clientDistribution: 'Client Distribution',
        monthlyGrowth: 'Monthly growth of your clientele',
        distributionByStatus: 'Distribution by activity status',
        activeClients: 'Active Clients',
        inactiveClients: 'Inactive Clients',
        prospectsContacts: 'Prospects/Contacts',
        newClients: 'New Clients',
        frequencyAnalysis: 'Monthly frequency analysis',
        
        // ==================== ACTIONS COMMUNES ====================
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        refresh: 'Refresh',
        view: 'View',
        details: 'Details',
        close: 'Close',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        
        // ==================== STATUTS ====================
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',
        new: 'New',
        contacted: 'Contacted',
        qualified: 'Qualified',
        converted: 'Converted',
        lost: 'Lost',
        
        // ==================== MESSAGES ====================
        loading: 'Loading...',
        noData: 'No data available',
        error: 'An error occurred',
        success: 'Operation successful',
        confirmDelete: 'Are you sure you want to delete this item?',
        operationSuccess: 'Operation completed successfully',
        operationError: 'Error during operation',
        dataLoaded: 'Data loaded',
        dataSaved: 'Data saved',
        
        // ==================== FORMULAIRES ====================
        name: 'Name',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        company: 'Company',
        message: 'Message',
        notes: 'Notes',
        date: 'Date',
        amount: 'Amount',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        description: 'Description',
        reference: 'Reference',
        category: 'Category',
        
        // ==================== PROSPECTS/CONTACTS ====================
        contactManagement: 'Demo Request Management',
        newProspects: 'New',
        convertedProspects: 'Converted',
        allStatuses: 'All Statuses',
        emailSent: 'Email Sent',
        contactProspect: 'Contact Prospect',
        prospectDetails: 'Prospect Details',
        sendEmail: 'Send Email',
        markAsContacted: 'Mark as Contacted',
        markAsQualified: 'Mark as Qualified',
        markAsConverted: 'Mark as Converted',
        markAsLost: 'Mark as Lost',
        
        // ==================== CLIENTS ====================
        clientManagement: 'Client Management',
        newClient: 'New Client',
        clientDetails: 'Client Details',
        clientHistory: 'Client History',
        addClient: 'Add Client',
        editClient: 'Edit Client',
        
        // ==================== PRODUITS ====================
        productManagement: 'Product Management',
        newProduct: 'New Product',
        productDetails: 'Product Details',
        addProduct: 'Add Product',
        editProduct: 'Edit Product',
        productName: 'Product Name',
        productPrice: 'Product Price',
        productCategory: 'Product Category',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        
        // ==================== COMMANDES ====================
        orderManagement: 'Order Management',
        newOrder: 'New Order',
        orderDetails: 'Order Details',
        orderStatus: 'Order Status',
        processOrder: 'Process Order',
        cancelOrder: 'Cancel Order',
        orderHistory: 'Order History',
        
        // ==================== RAPPORTS ====================
        reportManagement: 'Report Management',
        salesReport: 'Sales Report',
        clientReport: 'Client Report',
        productReport: 'Product Report',
        generateReport: 'Generate Report',
        exportPDF: 'Export to PDF',
        exportExcel: 'Export to Excel',
        exportCSV: 'Export to CSV',
        
        // ==================== PARAMÈTRES ====================
        language: 'Language',
        selectLanguage: 'Select Language',
        languageSettings: 'Language Settings',
        applicationLanguage: 'Application Language',
        myProfile: 'My Profile',
        companySettings: 'Company Settings',
        userManagement: 'User Management',
        emailConfiguration: 'Email Configuration',
        notifications: 'Notifications',
        appearance: 'Appearance',
        security: 'Security',
        system: 'System',
        
        // ==================== TEMPS ====================
        today: 'Today',
        yesterday: 'Yesterday',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        thisYear: 'This Year',
        lastMonth: 'Last Month',
        lastYear: 'Last Year',
        
        // ==================== PAGINATION ====================
        page: 'Page',
        of: 'of',
        itemsPerPage: 'Items per page',
        showing: 'Showing',
        to: 'to',
        results: 'results',
        
        // ==================== TABLEAUX ====================
        actions: 'Actions',
        createdAt: 'Created',
        updatedAt: 'Updated',
        status: 'Status',
        
        // ==================== INTERFACE ====================
        table: 'Table',
        cards: 'Cards',
        list: 'List',
        grid: 'Grid',
        reset: 'Reset',
        clear: 'Clear',
        
        // ==================== MOIS ====================
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
        
        // ==================== JOURS ====================
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      }
    };

    return translations[lang] || translations.fr;
  }
}