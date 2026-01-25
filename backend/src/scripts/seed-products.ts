import { DataSource } from 'typeorm';
import { Product, ProductCategory, ProductUnit } from '../products/entities/product.entity';

// Configuration de la base de données
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'crm',
  entities: [Product],
  synchronize: false,
});

// Données des produits électroniques
const electronicsProducts = [
  // 📱 SMARTPHONES & TABLETTES
  {
    name: 'iPhone 15 Pro Max',
    description: 'Le smartphone le plus avancé d\'Apple avec puce A17 Pro, appareil photo professionnel et écran Super Retina XDR de 6,7 pouces.',
    price: 1479.00,
    originalPrice: 1479.00,
    category: ProductCategory.SMARTPHONES,
    subcategory: 'Smartphones Premium',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    sku: 'APL-IP15PM-256',
    stockQuantity: 25,
    minStockLevel: 5,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: false,
    imageUrl: '/images/products/iphone-15-pro-max.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      ecran: '6,7" Super Retina XDR',
      processeur: 'A17 Pro',
      stockage: '256 GB',
      ram: '8 GB',
      appareil_photo: '48 MP + 12 MP + 12 MP',
      batterie: '4441 mAh',
      os: 'iOS 17',
      couleurs: ['Titane naturel', 'Titane bleu', 'Titane blanc', 'Titane noir']
    })
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone Android premium avec S Pen intégré, écran Dynamic AMOLED 6,8" et appareil photo 200MP.',
    price: 1399.00,
    originalPrice: 1499.00,
    category: ProductCategory.SMARTPHONES,
    subcategory: 'Smartphones Premium',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    sku: 'SAM-GS24U-256',
    stockQuantity: 18,
    minStockLevel: 5,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: true,
    imageUrl: '/images/products/galaxy-s24-ultra.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      ecran: '6,8" Dynamic AMOLED 2X',
      processeur: 'Snapdragon 8 Gen 3',
      stockage: '256 GB',
      ram: '12 GB',
      appareil_photo: '200 MP + 50 MP + 12 MP + 10 MP',
      batterie: '5000 mAh',
      os: 'Android 14',
      s_pen: 'Inclus'
    })
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'Tablette professionnelle avec puce M2, écran Liquid Retina XDR et compatibilité Apple Pencil.',
    price: 1449.00,
    originalPrice: 1449.00,
    category: ProductCategory.SMARTPHONES,
    subcategory: 'Tablettes',
    brand: 'Apple',
    model: 'iPad Pro 12.9"',
    sku: 'APL-IPADP-129-256',
    stockQuantity: 12,
    minStockLevel: 3,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/ipad-pro-129.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      ecran: '12,9" Liquid Retina XDR',
      processeur: 'Apple M2',
      stockage: '256 GB',
      ram: '8 GB',
      appareil_photo: '12 MP + 10 MP',
      batterie: '10 758 mAh',
      os: 'iPadOS 17',
      accessoires: 'Apple Pencil compatible'
    })
  },

  // 💻 ORDINATEURS & LAPTOPS
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Ordinateur portable professionnel avec puce M3 Pro, écran Liquid Retina XDR et autonomie exceptionnelle.',
    price: 2499.00,
    originalPrice: 2499.00,
    category: ProductCategory.COMPUTERS,
    subcategory: 'Laptops Premium',
    brand: 'Apple',
    model: 'MacBook Pro 14"',
    sku: 'APL-MBP14-M3P-512',
    stockQuantity: 8,
    minStockLevel: 2,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: false,
    imageUrl: '/images/products/macbook-pro-14.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      ecran: '14,2" Liquid Retina XDR',
      processeur: 'Apple M3 Pro',
      stockage: '512 GB SSD',
      ram: '18 GB',
      gpu: 'GPU 14 cœurs',
      batterie: 'Jusqu\'à 18h',
      os: 'macOS Sonoma',
      ports: '3x Thunderbolt 4, HDMI, SD'
    })
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Ultrabook Windows premium avec écran InfinityEdge, processeur Intel Core i7 et design ultra-fin.',
    price: 1899.00,
    originalPrice: 2099.00,
    category: ProductCategory.COMPUTERS,
    subcategory: 'Ultrabooks',
    brand: 'Dell',
    model: 'XPS 13 Plus',
    sku: 'DEL-XPS13P-I7-512',
    stockQuantity: 15,
    minStockLevel: 3,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/dell-xps-13-plus.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      ecran: '13,4" OLED 3.5K',
      processeur: 'Intel Core i7-1360P',
      stockage: '512 GB SSD',
      ram: '16 GB LPDDR5',
      gpu: 'Intel Iris Xe',
      batterie: 'Jusqu\'à 12h',
      os: 'Windows 11 Pro',
      poids: '1,26 kg'
    })
  },
  {
    name: 'Gaming PC RTX 4080 Custom',
    description: 'PC Gaming haute performance avec RTX 4080, processeur AMD Ryzen 7 et refroidissement liquide.',
    price: 2799.00,
    originalPrice: 2799.00,
    category: ProductCategory.COMPUTERS,
    subcategory: 'PC Gaming',
    brand: 'Custom Build',
    model: 'Gaming Pro RTX 4080',
    sku: 'CST-GPCRTX4080',
    stockQuantity: 5,
    minStockLevel: 1,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: false,
    imageUrl: '/images/products/gaming-pc-rtx4080.jpg',
    warrantyMonths: 36,
    specifications: JSON.stringify({
      processeur: 'AMD Ryzen 7 7700X',
      gpu: 'NVIDIA RTX 4080 16GB',
      ram: '32 GB DDR5-5600',
      stockage: '1TB NVMe SSD + 2TB HDD',
      carte_mere: 'B650 Chipset',
      alimentation: '850W 80+ Gold',
      refroidissement: 'AIO 240mm',
      boitier: 'Mid-Tower RGB'
    })
  },

  // 🎧 AUDIO & ACCESSOIRES
  {
    name: 'AirPods Pro 2ème génération',
    description: 'Écouteurs sans fil avec réduction de bruit active, audio spatial et boîtier de charge MagSafe.',
    price: 279.00,
    originalPrice: 279.00,
    category: ProductCategory.AUDIO,
    subcategory: 'Écouteurs Sans Fil',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    sku: 'APL-AIRPODSP2',
    stockQuantity: 45,
    minStockLevel: 10,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/airpods-pro-2.jpg',
    warrantyMonths: 12,
    specifications: JSON.stringify({
      type: 'Intra-auriculaires',
      reduction_bruit: 'Active (ANC)',
      autonomie: '6h + 24h (boîtier)',
      charge: 'Lightning + MagSafe',
      resistance: 'IPX4',
      audio_spatial: 'Oui',
      puce: 'H2',
      controles: 'Tactiles'
    })
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Casque audio premium avec réduction de bruit leader du marché et qualité sonore exceptionnelle.',
    price: 399.00,
    originalPrice: 449.00,
    category: ProductCategory.AUDIO,
    subcategory: 'Casques Audio',
    brand: 'Sony',
    model: 'WH-1000XM5',
    sku: 'SON-WH1000XM5',
    stockQuantity: 22,
    minStockLevel: 5,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/sony-wh1000xm5.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      type: 'Circum-auriculaires',
      reduction_bruit: 'Active (ANC)',
      autonomie: '30h avec ANC',
      charge: 'USB-C rapide',
      bluetooth: '5.2 + codecs HD',
      poids: '250g',
      assistant: 'Google/Alexa',
      pliable: 'Oui'
    })
  },

  // 📺 TV & ÉCRANS
  {
    name: 'Samsung Neo QLED 65" QN95C',
    description: 'TV QLED 4K 65 pouces avec Mini LED, HDR10+ et Smart TV Tizen pour une expérience cinéma.',
    price: 2199.00,
    originalPrice: 2499.00,
    category: ProductCategory.TV_SCREENS,
    subcategory: 'TV QLED',
    brand: 'Samsung',
    model: 'QN65QN95C',
    sku: 'SAM-QN95C-65',
    stockQuantity: 8,
    minStockLevel: 2,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/samsung-qn95c-65.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      taille: '65 pouces',
      resolution: '4K UHD (3840x2160)',
      technologie: 'Neo QLED Mini LED',
      hdr: 'HDR10+ / Dolby Vision',
      smart_tv: 'Tizen OS',
      gaming: '4K@120Hz, VRR, ALLM',
      audio: 'Dolby Atmos 60W',
      connectique: '4x HDMI 2.1, 2x USB'
    })
  },
  {
    name: 'LG UltraWide 34" 5K2K',
    description: 'Moniteur professionnel ultra-large 34 pouces avec résolution 5K2K et connectivité Thunderbolt.',
    price: 1299.00,
    originalPrice: 1299.00,
    category: ProductCategory.TV_SCREENS,
    subcategory: 'Moniteurs Pro',
    brand: 'LG',
    model: '34WK95U-W',
    sku: 'LG-34WK95U',
    stockQuantity: 12,
    minStockLevel: 3,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/lg-ultrawide-34.jpg',
    warrantyMonths: 36,
    specifications: JSON.stringify({
      taille: '34 pouces',
      resolution: '5120x2160 (5K2K)',
      ratio: '21:9 UltraWide',
      dalle: 'IPS Nano',
      couleurs: '98% DCI-P3',
      luminosite: '450 cd/m²',
      connectique: 'Thunderbolt 3, USB-C, HDMI',
      ergonomie: 'Réglable en hauteur'
    })
  },

  // 🏠 ÉLECTROMÉNAGER
  {
    name: 'Dyson V15 Detect Absolute',
    description: 'Aspirateur sans fil avec détection laser des poussières et technologie cyclonique avancée.',
    price: 749.00,
    originalPrice: 799.00,
    category: ProductCategory.APPLIANCES,
    subcategory: 'Aspirateurs',
    brand: 'Dyson',
    model: 'V15 Detect Absolute',
    sku: 'DYS-V15DETECT',
    stockQuantity: 15,
    minStockLevel: 3,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/dyson-v15-detect.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      type: 'Aspirateur balai sans fil',
      autonomie: 'Jusqu\'à 60 min',
      charge: '4,5h complète',
      capacite: '0,77L',
      poids: '3,1 kg',
      technologie: 'Cyclone Radial Root',
      detection: 'Laser vert',
      accessoires: '8 outils inclus'
    })
  },
  {
    name: 'Nespresso Vertuo Next',
    description: 'Machine à café à capsules avec technologie Centrifusion pour espresso et café long.',
    price: 199.00,
    originalPrice: 249.00,
    category: ProductCategory.APPLIANCES,
    subcategory: 'Machines à Café',
    brand: 'Nespresso',
    model: 'Vertuo Next',
    sku: 'NES-VERTUONEXT',
    stockQuantity: 28,
    minStockLevel: 8,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/nespresso-vertuo-next.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      type: 'Machine à capsules',
      technologie: 'Centrifusion',
      reservoir: '1,1L',
      capsules: 'Vertuo uniquement',
      tailles: '40ml à 414ml',
      chauffe: '30 secondes',
      arret_auto: 'Oui',
      bluetooth: 'Connectée'
    })
  },

  // ⚡ COMPOSANTS & PIÈCES
  {
    name: 'NVIDIA GeForce RTX 4070 Ti',
    description: 'Carte graphique gaming haute performance avec architecture Ada Lovelace et 12GB GDDR6X.',
    price: 899.00,
    originalPrice: 899.00,
    category: ProductCategory.COMPONENTS,
    subcategory: 'Cartes Graphiques',
    brand: 'NVIDIA',
    model: 'RTX 4070 Ti',
    sku: 'NVI-RTX4070TI',
    stockQuantity: 12,
    minStockLevel: 3,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: false,
    imageUrl: '/images/products/rtx-4070-ti.jpg',
    warrantyMonths: 36,
    specifications: JSON.stringify({
      gpu: 'AD104-400',
      memoire: '12 GB GDDR6X',
      bus: '192-bit',
      base_clock: '2310 MHz',
      boost_clock: '2610 MHz',
      rt_cores: '60 (3ème gen)',
      tensor_cores: '240 (4ème gen)',
      tdp: '285W',
      connecteurs: '2x 8-pin'
    })
  },
  {
    name: 'AMD Ryzen 7 7700X',
    description: 'Processeur 8 cœurs/16 threads avec architecture Zen 4 et socket AM5 pour gaming et création.',
    price: 399.00,
    originalPrice: 449.00,
    category: ProductCategory.COMPONENTS,
    subcategory: 'Processeurs',
    brand: 'AMD',
    model: 'Ryzen 7 7700X',
    sku: 'AMD-R77700X',
    stockQuantity: 18,
    minStockLevel: 5,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: true,
    imageUrl: '/images/products/ryzen-7-7700x.jpg',
    warrantyMonths: 36,
    specifications: JSON.stringify({
      coeurs: '8 cœurs / 16 threads',
      architecture: 'Zen 4',
      socket: 'AM5',
      base_clock: '4,5 GHz',
      boost_clock: '5,4 GHz',
      cache_l3: '32 MB',
      tdp: '105W',
      gravure: '5nm TSMC'
    })
  },

  // 🔌 CÂBLES & CHARGEURS
  {
    name: 'Chargeur USB-C 100W GaN',
    description: 'Chargeur rapide compact avec technologie GaN, compatible MacBook, iPad et smartphones.',
    price: 79.00,
    originalPrice: 79.00,
    category: ProductCategory.CABLES,
    subcategory: 'Chargeurs',
    brand: 'Anker',
    model: 'PowerPort Atom III',
    sku: 'ANK-PP100W-GAN',
    stockQuantity: 35,
    minStockLevel: 10,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/anker-charger-100w.jpg',
    warrantyMonths: 18,
    specifications: JSON.stringify({
      puissance: '100W max',
      technologie: 'GaN (Nitrure de Gallium)',
      ports: '1x USB-C PD',
      compatibilite: 'MacBook, iPad, iPhone, Android',
      protection: 'Surtension, surchauffe',
      taille: '6,8 x 6,8 x 3,4 cm',
      poids: '192g',
      cable: 'USB-C vers USB-C inclus'
    })
  },
  {
    name: 'Câble Thunderbolt 4 - 2m',
    description: 'Câble Thunderbolt 4 certifié Intel avec transfert 40Gbps et charge 100W.',
    price: 129.00,
    originalPrice: 129.00,
    category: ProductCategory.CABLES,
    subcategory: 'Câbles Data',
    brand: 'CalDigit',
    model: 'Thunderbolt 4 Cable',
    sku: 'CAL-TB4-2M',
    stockQuantity: 25,
    minStockLevel: 8,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/thunderbolt-4-cable.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      standard: 'Thunderbolt 4 / USB4',
      longueur: '2 mètres',
      debit: '40 Gbps',
      charge: '100W PD',
      video: '8K@30Hz ou 4K@60Hz',
      certification: 'Intel Certified',
      connecteurs: 'USB-C vers USB-C',
      blindage: 'Triple blindage'
    })
  },

  // 🎮 GAMING & CONSOLES
  {
    name: 'PlayStation 5 Slim',
    description: 'Console de jeu nouvelle génération avec SSD ultra-rapide et manette DualSense.',
    price: 549.00,
    originalPrice: 549.00,
    category: ProductCategory.GAMING,
    subcategory: 'Consoles',
    brand: 'Sony',
    model: 'PlayStation 5 Slim',
    sku: 'SON-PS5SLIM',
    stockQuantity: 8,
    minStockLevel: 2,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: true,
    isPromotion: false,
    imageUrl: '/images/products/ps5-slim.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      processeur: 'AMD Zen 2 8-core',
      gpu: 'AMD RDNA 2',
      ram: '16 GB GDDR6',
      stockage: '1 TB SSD NVMe',
      resolution: '4K@120Hz, 8K',
      ray_tracing: 'Hardware RT',
      manette: 'DualSense incluse',
      retrocompatibilite: 'PS4'
    })
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    description: 'Souris gaming sans fil avec capteur Focus Pro 30K et switches optiques Razer.',
    price: 149.00,
    originalPrice: 149.00,
    category: ProductCategory.GAMING,
    subcategory: 'Périphériques Gaming',
    brand: 'Razer',
    model: 'DeathAdder V3 Pro',
    sku: 'RAZ-DAV3PRO',
    stockQuantity: 22,
    minStockLevel: 5,
    unit: ProductUnit.PIECE,
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '/images/products/razer-deathadder-v3-pro.jpg',
    warrantyMonths: 24,
    specifications: JSON.stringify({
      capteur: 'Focus Pro 30K',
      dpi: '30 000 DPI max',
      switches: 'Optiques Razer Gen-3',
      autonomie: '90h (2.4GHz)',
      poids: '63g',
      connectivite: '2.4GHz + Bluetooth',
      rgb: 'Chroma RGB',
      boutons: '8 programmables'
    })
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Initialisation de la connexion à la base de données...');
    await AppDataSource.initialize();
    
    const productRepository = AppDataSource.getRepository(Product);
    
    console.log('🗑️ Suppression des produits existants...');
    await productRepository.clear();
    
    console.log('📦 Insertion des nouveaux produits électroniques...');
    
    for (const productData of electronicsProducts) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
      console.log(`✅ Produit créé: ${product.name} (${product.brand})`);
    }
    
    console.log(`🎉 Seeder terminé avec succès ! ${electronicsProducts.length} produits électroniques ajoutés.`);
    
    // Statistiques par catégorie
    const stats = await productRepository
      .createQueryBuilder('product')
      .select('product.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.category')
      .getRawMany();
    
    console.log('\n📊 Répartition par catégorie:');
    stats.forEach(stat => {
      console.log(`   ${stat.category}: ${stat.count} produits`);
    });
    
    // Produits en promotion
    const promotions = await productRepository.count({ where: { isPromotion: true } });
    console.log(`\n🏷️ Produits en promotion: ${promotions}`);
    
    // Nouveaux produits
    const nouveaux = await productRepository.count({ where: { isNew: true } });
    console.log(`🆕 Nouveaux produits: ${nouveaux}`);
    
    // Valeur totale du stock
    const totalValue = await productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stockQuantity)', 'total')
      .getRawOne();
    
    console.log(`💰 Valeur totale du stock: ${parseFloat(totalValue.total).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connexion fermée.');
  }
}

// Exécuter le seeder
if (require.main === module) {
  seedProducts();
}

export { seedProducts };