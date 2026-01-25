import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, IsNull } from 'typeorm';
import { Category, CategoryStatus } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Créer une nouvelle catégorie
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      this.logger.log(`📝 Création catégorie: ${createCategoryDto.name}`);

      // Générer le slug si non fourni
      if (!createCategoryDto.slug) {
        createCategoryDto.slug = this.generateSlug(createCategoryDto.name);
      }

      // Vérifier l'unicité du slug
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: createCategoryDto.slug }
      });

      if (existingCategory) {
        throw new ConflictException(`Une catégorie avec le slug "${createCategoryDto.slug}" existe déjà`);
      }

      // Vérifier que la catégorie parent existe si spécifiée
      if (createCategoryDto.parentId) {
        const parent = await this.categoryRepository.findOne({
          where: { id: createCategoryDto.parentId }
        });
        if (!parent) {
          throw new NotFoundException(`Catégorie parent avec l'ID ${createCategoryDto.parentId} non trouvée`);
        }
      }

      // Définir l'ordre de tri si non spécifié
      if (createCategoryDto.sortOrder === undefined) {
        const maxOrder = await this.categoryRepository
          .createQueryBuilder('category')
          .select('MAX(category.sortOrder)', 'maxOrder')
          .where('category.parentId = :parentId', { 
            parentId: createCategoryDto.parentId || null 
          })
          .getRawOne();
        
        createCategoryDto.sortOrder = (maxOrder.maxOrder || 0) + 1;
      }

      const category = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(category);

      this.logger.log(`✅ Catégorie créée: ${savedCategory.name} (ID: ${savedCategory.id})`);
      return savedCategory;
    } catch (error) {
      this.logger.error(`❌ Erreur création catégorie: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupérer toutes les catégories avec hiérarchie
   */
  async findAll(includeInactive = false): Promise<Category[]> {
    try {
      const queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.parent', 'parent')
        .leftJoinAndSelect('category.children', 'children')
        .orderBy('category.sortOrder', 'ASC')
        .addOrderBy('children.sortOrder', 'ASC');

      if (!includeInactive) {
        queryBuilder.where('category.active = :active', { active: true });
      }

      const categories = await queryBuilder.getMany();
      
      this.logger.log(`📊 ${categories.length} catégories récupérées`);
      return categories;
    } catch (error) {
      this.logger.error(`❌ Erreur récupération catégories: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupérer l'arbre hiérarchique des catégories
   */
  async getTree(includeInactive = false): Promise<Category[]> {
    try {
      // Récupérer toutes les catégories
      const allCategories = await this.findAll(includeInactive);
      
      // Construire l'arbre hiérarchique
      const categoryMap = new Map<number, Category>();
      const rootCategories: Category[] = [];

      // Première passe : créer la map
      allCategories.forEach(category => {
        const categoryWithChildren = Object.assign(Object.create(Object.getPrototypeOf(category)), category);
        categoryWithChildren.children = [];
        categoryMap.set(category.id, categoryWithChildren);
      });

      // Deuxième passe : construire la hiérarchie
      allCategories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id);
        
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId);
          if (parent) {
            parent.children.push(categoryWithChildren);
          }
        } else {
          rootCategories.push(categoryWithChildren);
        }
      });

      this.logger.log(`🌳 Arbre hiérarchique construit: ${rootCategories.length} catégories racines`);
      return rootCategories;
    } catch (error) {
      this.logger.error(`❌ Erreur construction arbre: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupérer une catégorie par ID
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children']
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    return category;
  }

  /**
   * Récupérer une catégorie par slug
   */
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children']
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec le slug "${slug}" non trouvée`);
    }

    return category;
  }

  /**
   * Mettre à jour une catégorie
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.findOne(id);

      // Générer le slug si le nom a changé
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        if (!updateCategoryDto.slug) {
          updateCategoryDto.slug = this.generateSlug(updateCategoryDto.name);
        }

        // Vérifier l'unicité du nouveau slug
        const existingCategory = await this.categoryRepository.findOne({
          where: { slug: updateCategoryDto.slug }
        });

        if (existingCategory && existingCategory.id !== id) {
          throw new ConflictException(`Une catégorie avec le slug "${updateCategoryDto.slug}" existe déjà`);
        }
      }

      // Vérifier que la catégorie parent existe si spécifiée
      if (updateCategoryDto.parentId) {
        if (updateCategoryDto.parentId === id) {
          throw new BadRequestException('Une catégorie ne peut pas être son propre parent');
        }

        const parent = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentId }
        });
        if (!parent) {
          throw new NotFoundException(`Catégorie parent avec l'ID ${updateCategoryDto.parentId} non trouvée`);
        }

        // Vérifier qu'on ne crée pas de boucle
        if (await this.wouldCreateLoop(id, updateCategoryDto.parentId)) {
          throw new BadRequestException('Cette modification créerait une boucle dans la hiérarchie');
        }
      }

      Object.assign(category, updateCategoryDto);
      const updatedCategory = await this.categoryRepository.save(category);

      this.logger.log(`📝 Catégorie mise à jour: ${updatedCategory.name} (ID: ${id})`);
      return updatedCategory;
    } catch (error) {
      this.logger.error(`❌ Erreur mise à jour catégorie ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer une catégorie
   */
  async remove(id: number): Promise<void> {
    try {
      const category = await this.findOne(id);

      // Vérifier s'il y a des sous-catégories
      const childrenCount = await this.categoryRepository.count({
        where: { parentId: id }
      });

      if (childrenCount > 0) {
        throw new BadRequestException('Impossible de supprimer une catégorie qui contient des sous-catégories');
      }

      // TODO: Vérifier s'il y a des produits associés
      // const productsCount = await this.productRepository.count({ where: { categoryId: id } });
      // if (productsCount > 0) {
      //   throw new BadRequestException('Impossible de supprimer une catégorie qui contient des produits');
      // }

      await this.categoryRepository.remove(category);
      this.logger.log(`🗑️ Catégorie supprimée: ${category.name} (ID: ${id})`);
    } catch (error) {
      this.logger.error(`❌ Erreur suppression catégorie ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Réorganiser les catégories (drag & drop)
   */
  async reorder(categoryId: number, newParentId: number | null, newOrder: number): Promise<void> {
    try {
      const category = await this.findOne(categoryId);

      // Vérifier que le nouveau parent existe
      if (newParentId) {
        const newParent = await this.categoryRepository.findOne({
          where: { id: newParentId }
        });
        if (!newParent) {
          throw new NotFoundException(`Catégorie parent avec l'ID ${newParentId} non trouvée`);
        }

        // Vérifier qu'on ne crée pas de boucle
        if (await this.wouldCreateLoop(categoryId, newParentId)) {
          throw new BadRequestException('Cette modification créerait une boucle dans la hiérarchie');
        }
      }

      // Mettre à jour la catégorie
      category.parentId = newParentId;
      category.sortOrder = newOrder;

      await this.categoryRepository.save(category);

      // Réorganiser les autres catégories du même niveau
      await this.reorderSiblings(newParentId, categoryId, newOrder);

      this.logger.log(`🔄 Catégorie réorganisée: ${category.name}`);
    } catch (error) {
      this.logger.error(`❌ Erreur réorganisation catégorie ${categoryId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des catégories
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    parents: number;
    children: number;
    maxDepth: number;
  }> {
    try {
      const [total, active, parents] = await Promise.all([
        this.categoryRepository.count(),
        this.categoryRepository.count({ where: { active: true } }),
        this.categoryRepository.count({ where: { parentId: IsNull() } })
      ]);

      const inactive = total - active;
      const children = total - parents;

      // Calculer la profondeur maximale (simplifié)
      const maxDepth = await this.calculateMaxDepth();

      return { total, active, inactive, parents, children, maxDepth };
    } catch (error) {
      this.logger.error(`❌ Erreur calcul statistiques: ${error.message}`);
      throw error;
    }
  }

  /**
   * Méthodes utilitaires privées
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async wouldCreateLoop(categoryId: number, newParentId: number): Promise<boolean> {
    // Vérification récursive pour éviter les boucles
    let currentParentId = newParentId;
    
    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true;
      }
      
      const parent = await this.categoryRepository.findOne({
        where: { id: currentParentId }
      });
      
      currentParentId = parent?.parentId;
    }
    
    return false;
  }

  private async reorderSiblings(parentId: number | null, excludeId: number, newOrder: number): Promise<void> {
    // Récupérer toutes les catégories du même niveau
    const siblings = await this.categoryRepository.find({
      where: { parentId: parentId || IsNull() },
      order: { sortOrder: 'ASC' }
    });

    // Réorganiser les ordres
    let order = 1;
    for (const sibling of siblings) {
      if (sibling.id === excludeId) continue;
      
      if (order === newOrder) {
        order++; // Laisser la place pour la catégorie déplacée
      }
      
      if (sibling.sortOrder !== order) {
        sibling.sortOrder = order;
        await this.categoryRepository.save(sibling);
      }
      
      order++;
    }
  }

  private async calculateMaxDepth(): Promise<number> {
    // Calcul simplifié de la profondeur maximale
    const query = `
      WITH RECURSIVE category_depth AS (
        SELECT id, "parentId", 1 as depth
        FROM categories
        WHERE "parentId" IS NULL
        
        UNION ALL
        
        SELECT c.id, c."parentId", cd.depth + 1
        FROM categories c
        INNER JOIN category_depth cd ON c."parentId" = cd.id
      )
      SELECT MAX(depth) as max_depth FROM category_depth
    `;

    const result = await this.categoryRepository.query(query);
    return result[0]?.max_depth || 1;
  }
}