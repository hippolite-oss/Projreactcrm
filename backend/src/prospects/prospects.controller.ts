import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Request,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { SendEmailProspectDto } from './dto/send-email-prospect.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  /**
   * Créer un prospect (endpoint public - pas d'authentification)
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.create(createProspectDto);
  }

  /**
   * Lister tous les prospects (admin seulement)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('search') search?: string,
    @Query('statut') statut?: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.prospectsService.findAll(+page, +limit, search, statut, sortBy, sortOrder);
  }

  /**
   * Obtenir les statistiques des prospects (admin seulement)
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.prospectsService.getStats();
  }

  /**
   * Obtenir un prospect par ID (admin seulement)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.prospectsService.findOne(+id);
  }

  /**
   * Mettre à jour un prospect (admin seulement)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateProspectDto: UpdateProspectDto) {
    return this.prospectsService.update(+id, updateProspectDto);
  }

  /**
   * Marquer un prospect comme contacté (admin seulement)
   */
  @Put(':id/contact')
  @UseGuards(JwtAuthGuard)
  marquerContacte(@Param('id') id: string, @Request() req) {
    const adminEmail = req.user?.email;
    return this.prospectsService.marquerContacte(+id, adminEmail);
  }

  /**
   * Envoyer un email à un prospect (admin seulement)
   */
  @Post(':id/email')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  sendEmail(
    @Param('id') id: string, 
    @Body() sendEmailDto: SendEmailProspectDto,
    @Request() req
  ) {
    const adminEmail = req.user?.email;
    return this.prospectsService.sendEmail(+id, sendEmailDto, adminEmail);
  }

  /**
   * Supprimer un prospect (admin seulement)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.prospectsService.remove(+id);
  }
}