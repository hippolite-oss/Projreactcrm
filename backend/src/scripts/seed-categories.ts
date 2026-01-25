import { DataSource } from 'typeorm';
import { Category, CategoryStatus } from '../categories/entities/category.entity';

// Configuration de la base de données
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'crm',
  entities: [Category],
  synchronize: false,
});

// Données des catégories principales
const mainCategories = [
  {
    name: 'Smartphones & Tablettes',
    slug: 'smartphones-tablettes',
    description: 'Smartphones, tablettes et accessoires mobiles',
    icon: 'Smartphone',
    color: 'blue',
    sortOrder: 1,
    metaTitle: 'Smartphones et Tablettes',
    keywords: 'smartphone, tablette, mobile, iPhone, Samsung'
  },
  {
    name: 'Ordinateurs & Laptops',
    slug: 'ordinateurs-laptops',
    description: 'Ordinateurs portables et PC de bureau',
    icon: 'Monitor',
    color: 'purple',
    sortOrder: 2,
    metaTitle: 'Ordinateurs et Laptops',
    keywords: 'ordinateur, laptop, PC, MacBook, gaming'
  },
  {
    name: 'Audio & Accessoires',
    slug: 'audio-accessoires',
    description: 'Casques, écouteurs et équipements audio',
    icon: 'Headphones',
    color: 'green',
    sortOrder: 3,
    metaTitle: 'Audio et Accessoires',
    keywords: 'casque, écouteurs, audio, son, musique'
  },
  {
    name: 'TV & Écrans',
    slug: 'tv-ecrans',
    description: 'Téléviseurs, moniteurs et écrans',
    icon: 'Tv',
    color: 'red',
    sortOrder: 4,
    metaTitle: 'TV et Écrans',
    keywords: 'télévision, TV, moniteur, écran, OLED'
  },
  {
    name: 'Électroménager',
    slug: 'electromenager',
    description: 'Appareils électroménagers et maison connectée',
    icon: 'Home',
    color: 'orange',
    sortOrder: 5,
    metaTitle: 'Électroménager',
    keywords: 'électroménager, aspirateur, cuisine, maison'
  },
  {
    name: 'Composants & Pièces',
    slug: 'composants-pieces',
    description: 'Composants informatiques et pièces détachées',
    icon: 'Cpu',
    color: 'yellow',
    sortOrder: 6,
    metaTitle: 'Composants et Pièces',
    keywords: 'composant, processeur, carte graphique, RAM'
  },
  {
    name: 'Câbles & Chargeurs',
    slug: 'cables-chargeurs',
    description: 'Câbles, chargeurs et accessoires de connectique',
    icon: 'Cable',
    color: 'gray',
    sortOrder: 7,
    metaTitle: 'Câbles et Chargeurs',
    keywords: 'câble, chargeur, USB, connectique'
  },
  {
    name: 'Gaming & Consoles',
    slug: 'gaming-consoles',
    description: 'Consoles de jeu et périphériques gaming',
    icon: 'Gamepad2',
    color: 'pink',
    sortOrder: 8,
    metaTitle: 'Gaming et Consoles',
    keywords: 'gaming, console, jeu, PlayStation, Xbox'
  }
];

// Sous-catégories par catégorie principale
const subcategoriesData = {
  'smartphones-tablettes': [
    { name: 'Smartphones Premium', slug: 'smartphones-premium', sortOrder: 1 },
    { name: 'Smartphones Milieu de gamme', slug: 'smartphones-milieu-gamme', sortOrder: 2 },
    { name: 'Tablettes', slug: 'tablettes', sortOrder: 3 },
    { name: 'Accessoires Mobile', slug: 'accessoires-mobile', sortOrder: 4 }
  ],
  'ordinateurs-laptops': [
    { name: 'Laptops Premium', slug: 'laptops-premium', sortOrder: 1 },
    { name: 'Ultrabooks', slug: 'ultrabooks', sortOrder: 2 },
    { name: 'PC Gaming', slug: 'pc-gaming', sortOrder: 3 },
    { name: 'PC Bureau', slug: 'pc-bureau', sortOrder: 4 },
    { name: 'Workstations', slug: 'workstations', sortOrder: 5 }
  ],
  'audio-accessoires': [
    { name: 'Écouteurs Sans Fil', slug: 'ecouteurs-sans-fil', sortOrder: 1 },
    { name: 'Casques Audio', slug: 'casques-audio', sortOrder: 2 },
    { name: 'Enceintes', slug: 'enceintes', sortOrder: 3 },
    { name: 'Accessoires Audio', slug: 'accessoires-audio', sortOrder: 4 }
  ],
  'tv-ecrans': [
    { name: 'TV QLED', slug: 'tv-qled', sortOrder: 1 },
    { name: 'TV OLED', slug: 'tv-oled', sortOrder: 2 },
    { name: 'Moniteurs Pro', slug: 'moniteurs-pro', sortOrder: 3 },
    { name: 'Moniteurs Gaming', slug: 'moniteurs-gaming', sortOrder: 4 },
    { name: 'Projecteurs', slug: 'projecteurs', sortOrder: 5 }
  ],
  'electromenager': [
    { name: 'Aspirateurs', slug: 'aspirateurs', sortOrder: 1 },
    { name: 'Machines à Café', slug: 'machines-cafe', sortOrder: 2 },
    { name: 'Petit Électroménager', slug: 'petit-electromenager', sortOrder: 3 },
    { name: 'Gros Électroménager', slug: 'gros-electromenager', sortOrder: 4 }
  ],
  'composants-pieces': [
    { name: 'Cartes Graphiques', slug: 'cartes-graphiques', sortOrder: 1 },
    { name: 'Processeurs', slug: 'processeurs', sortOrder: 2 },
    { name: 'Mémoire RAM', slug: 'memoire-ram', sortOrder: 3 },
    { name: 'Stockage', slug: 'stockage', sortOrder: 4 },
    { name: 'Cartes Mères', slug: 'cartes-meres', sortOrder: 5 }
  ],
  'cables-chargeurs': [
    { name: 'Chargeurs', slug: 'chargeurs', sortOrder: 1 },
    { name: 'Câbles Data', slug: 'cables-data', sortOrder: 2 },
    { name: 'Adaptateurs', slug: 'adaptateurs', sortOrder: 3 },
    { name: 'Hubs USB', slug: 'hubs-usb', sortOrder: 4 }
  ],
  'gaming-consoles': [
    { name: 'Consoles', slug: 'consoles', sortOrder: 1 },
    { name: 'Périphériques Gaming', slug: 'peripheriques-gaming', sortOrder: 2 },
    { name: 'Jeux', slug: 'jeux', sortOrder: 3 },
    { name: 'Accessoires Gaming', slug: 'accessoires-gaming', sortOrder: 4 }
  ]
};

async function seedCategories() {
  try {
    console.log('🌱 Initialisation de la connexion à la base de données...');
    await AppDataSource.initialize();
    
    const categoryRepository = AppDataSource.getRepository(Category);
    
    console.log('🗑️ Suppression des catégories existantes...');
    await categoryRepository.clear();
    
    console.log('📂 Création des catégories principales...');
    
    const createdCategories = new Map<string, Category>();
    
    // Créer les catégories principales
    for (const categoryData of mainCategories) {
      const category = categoryRepository.create({
        ...categoryData,
        active: true,
        status: CategoryStatus.ACTIVE,
        parentId: null
      });
      
      const savedCategory = await categoryRepository.save(category);
      createdCategories.set(categoryData.slug, savedCategory);
      
      console.log(`✅ Catégorie principale créée: ${savedCategory.name}`);
    }
    
    console.log('📁 Création des sous-catégories...');
    
    // Créer les sous-catégories
    for (const [parentSlug, subcategories] of Object.entries(subcategoriesData)) {
      const parentCategory = createdCategories.get(parentSlug);
      
      if (parentCategory) {
        for (const subcategoryData of subcategories) {
          const subcategory = categoryRepository.create({
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            description: `Sous-catégorie de ${parentCategory.name}`,
            sortOrder: subcategoryData.sortOrder,
            active: true,
            status: CategoryStatus.ACTIVE,
            parentId: parentCategory.id,
            icon: parentCategory.icon,
            color: parentCategory.color
          });
          
          const savedSubcategory = await categoryRepository.save(subcategory);
          console.log(`  ✅ Sous-catégorie créée: ${savedSubcategory.name} (parent: ${parentCategory.name})`);
        }
      }
    }
    
    console.log('🎉 Seeder terminé avec succès !');
    
    // Statistiques finales
    const stats = await categoryRepository
      .createQueryBuilder('category')
      .select([
        'COUNT(*) as total',
        'COUNT(CASE WHEN category.parentId IS NULL THEN 1 END) as parents',
        'COUNT(CASE WHEN category.parentId IS NOT NULL THEN 1 END) as children'
      ])
      .getRawOne();
    
    console.log('\n📊 Statistiques des catégories:');
    console.log(`   Total: ${stats.total} catégories`);
    console.log(`   Principales: ${stats.parents} catégories`);
    console.log(`   Sous-catégories: ${stats.children} catégories`);
    
    // Afficher la hiérarchie
    console.log('\n🌳 Hiérarchie créée:');
    const mainCats = await categoryRepository.find({
      where: { parentId: null },
      relations: ['children'],
      order: { sortOrder: 'ASC' }
    });
    
    for (const mainCat of mainCats) {
      console.log(`📂 ${mainCat.name} (${mainCat.children.length} sous-catégories)`);
      for (const child of mainCat.children.sort((a, b) => a.sortOrder - b.sortOrder)) {
        console.log(`   📁 ${child.name}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connexion fermée.');
  }
}

// Exécuter le seeder
if (require.main === module) {
  seedCategories();
}

export { seedCategories };