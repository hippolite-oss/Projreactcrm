import { DataSource } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { QuoteItem } from '../quotes/entities/quote-item.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceItem } from '../invoices/entities/invoice-item.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { CommandeOnline } from '../commandes-online/entities/commande-online.entity';

// Configuration de la base de données
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'crm',
  entities: [
    Client, 
    Contact, 
    Quote, 
    QuoteItem, 
    Invoice, 
    InvoiceItem, 
    Product, 
    Category, 
    User, 
    CommandeOnline
  ],
  synchronize: false,
});

// Données des clients de test
const clientsData = [
  {
    name: 'TechCorp Solutions',
    email: 'contact@techcorp-solutions.fr',
    phone: '+33 1 42 86 75 30',
    address: '15 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    country: 'France'
  },
  {
    name: 'Digital Innovation SARL',
    email: 'info@digital-innovation.com',
    phone: '+33 4 78 92 15 67',
    address: '42 Rue de la République',
    city: 'Lyon',
    postalCode: '69002',
    country: 'France'
  },
  {
    name: 'StartUp Dynamics',
    email: 'hello@startup-dynamics.fr',
    phone: '+33 5 56 48 73 21',
    address: '8 Place de la Bourse',
    city: 'Bordeaux',
    postalCode: '33000',
    country: 'France'
  },
  {
    name: 'E-Commerce Plus',
    email: 'contact@ecommerce-plus.fr',
    phone: '+33 4 91 55 82 94',
    address: '25 La Canebière',
    city: 'Marseille',
    postalCode: '13001',
    country: 'France'
  }
];

// Données des prospects/contacts
const contactsData = [
  {
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@entreprise-a.fr',
    phone: '+33 1 45 67 89 12',
    position: 'Directrice Marketing'
  },
  {
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'p.martin@societe-b.com',
    phone: '+33 2 98 76 54 32',
    position: 'Chef de Projet'
  },
  {
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@startup-c.fr',
    phone: '+33 3 88 12 34 56',
    position: 'Responsable Commercial'
  },
  {
    firstName: 'Thomas',
    lastName: 'Moreau',
    email: 'thomas.moreau@agence-d.fr',
    phone: '+33 4 76 98 12 34',
    position: 'Directeur Technique'
  },
  {
    firstName: 'Julie',
    lastName: 'Bernard',
    email: 'j.bernard@consulting-e.com',
    phone: '+33 5 61 23 45 67',
    position: 'Consultante Senior'
  },
  {
    firstName: 'Alexandre',
    lastName: 'Petit',
    email: 'a.petit@tech-f.fr',
    phone: '+33 2 40 87 65 43',
    position: 'Développeur Lead'
  },
  {
    firstName: 'Camille',
    lastName: 'Roux',
    email: 'camille.roux@digital-g.fr',
    phone: '+33 4 67 89 12 34',
    position: 'Product Manager'
  },
  {
    firstName: 'Nicolas',
    lastName: 'Fournier',
    email: 'n.fournier@innovation-h.com',
    phone: '+33 3 20 56 78 90',
    position: 'CTO'
  },
  {
    firstName: 'Émilie',
    lastName: 'Girard',
    email: 'emilie.girard@solutions-i.fr',
    phone: '+33 4 72 34 56 78',
    position: 'Directrice Générale'
  }
];

async function seedClients() {
  try {
    console.log('🌱 Initialisation de la connexion à la base de données...');
    await AppDataSource.initialize();
    
    const clientRepository = AppDataSource.getRepository(Client);
    const contactRepository = AppDataSource.getRepository(Contact);
    
    // Vérifier les clients existants
    const existingClients = await clientRepository.count();
    console.log(`📊 Clients existants: ${existingClients}`);
    
    if (existingClients >= 4) {
      console.log('ℹ️ Il y a déjà 4 clients ou plus dans la base de données');
      console.log('🔍 Affichage des clients existants:');
      
      const clients = await clientRepository.find({
        order: { createdAt: 'DESC' }
      });
      
      clients.forEach((client, index) => {
        console.log(`${index + 1}. ${client.name}`);
        console.log(`   📧 ${client.email}`);
        console.log(`   📞 ${client.phone}`);
        console.log(`   🏙️ ${client.city}`);
        console.log(`   📅 Créé le: ${client.createdAt.toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('📦 Création des clients de test...');
      
      for (const clientData of clientsData) {
        const client = clientRepository.create(clientData);
        await clientRepository.save(client);
        console.log(`✅ Client créé: ${client.name}`);
      }
      
      console.log(`🎉 ${clientsData.length} clients créés avec succès !`);
    }
    
    // Vérifier les contacts/prospects existants
    const existingContacts = await contactRepository.count();
    console.log(`📊 Contacts/prospects existants: ${existingContacts}`);
    
    if (existingContacts >= 9) {
      console.log('ℹ️ Il y a déjà 9 contacts/prospects ou plus dans la base de données');
    } else {
      console.log('📞 Création des contacts/prospects de test...');
      
      for (const contactData of contactsData) {
        const contact = contactRepository.create(contactData);
        await contactRepository.save(contact);
        console.log(`✅ Contact créé: ${contact.firstName} ${contact.lastName}`);
      }
      
      console.log(`🎉 ${contactsData.length} contacts/prospects créés avec succès !`);
    }
    
    // Statistiques finales
    const finalClientCount = await clientRepository.count();
    const finalContactCount = await contactRepository.count();
    
    console.log('\n📊 Statistiques finales:');
    console.log(`   👥 Clients: ${finalClientCount}`);
    console.log(`   📞 Contacts/Prospects: ${finalContactCount}`);
    console.log(`   📈 Total: ${finalClientCount + finalContactCount} entrées`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connexion fermée.');
  }
}

// Exécuter le seeder
if (require.main === module) {
  seedClients();
}

export { seedClients };