import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

async function initUser() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'crm',
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Vérifier si un utilisateur existe déjà
  const existingUser = await userRepository.findOne({
    where: { email: 'admin@crm.com' },
  });

  if (existingUser) {
    console.log('Utilisateur admin@crm.com existe déjà');
    await dataSource.destroy();
    return;
  }

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = userRepository.create({
    email: 'admin@crm.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'CRM',
    role: 'admin',
  });

  await userRepository.save(user);
  console.log('Utilisateur créé avec succès:');
  console.log('Email: admin@crm.com');
  console.log('Mot de passe: admin123');

  await dataSource.destroy();
}

initUser().catch((error) => {
  console.error('Erreur lors de l\'initialisation:', error);
  process.exit(1);
});

