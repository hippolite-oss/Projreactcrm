import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  // Méthode publique pour la page d'accueil
  async getFeaturedProducts(): Promise<Product[]> {
    console.log('🔍 Récupération des produits phares...');
    
    const products = await this.productsRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
      take: 8, // Limiter à 8 produits
      select: ['id', 'name', 'price', 'imageUrl', 'stockQuantity', 'category'] // Sélectionner seulement les champs nécessaires
    });

    console.log(`✅ ${products.length} produits phares récupérés`);
    return products;
  }
}

