import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveFlag = includeInactive === 'true';
    return this.categoriesService.findAll(includeInactiveFlag);
  }

  @Get('tree')
  getTree(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveFlag = includeInactive === 'true';
    return this.categoriesService.getTree(includeInactiveFlag);
  }

  @Get('stats')
  getStats() {
    return this.categoriesService.getStats();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/reorder')
  reorder(
    @Param('id', ParseIntPipe) id: number,
    @Body() reorderDto: { newParentId?: number; newOrder: number },
  ) {
    return this.categoriesService.reorder(
      id,
      reorderDto.newParentId || null,
      reorderDto.newOrder,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}