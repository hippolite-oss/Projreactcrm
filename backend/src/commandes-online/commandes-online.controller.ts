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
  Put,
  Request,
} from '@nestjs/common';
import { CommandesOnlineService } from './commandes-online.service';
import { CreateCommandeOnlineDto } from './dto/create-commande-online.dto';
import { UpdateCommandeOnlineDto } from './dto/update-commande-online.dto';
import { TraiterCommandeDto, AnnulerCommandeDto } from './dto/traiter-commande.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commande-online')
export class CommandesOnlineController {
  constructor(private readonly commandesOnlineService: CommandesOnlineService) {}

  @Post()
  create(@Body() createCommandeOnlineDto: CreateCommandeOnlineDto) {
    return this.commandesOnlineService.create(createCommandeOnlineDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('search') search?: string,
    @Query('statut') statut?: string,
  ) {
    return this.commandesOnlineService.findAll(+page, +limit, search, statut);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.commandesOnlineService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.commandesOnlineService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCommandeOnlineDto: UpdateCommandeOnlineDto) {
    return this.commandesOnlineService.update(+id, updateCommandeOnlineDto);
  }

  @Put(':id/mark-as-read')
  @UseGuards(JwtAuthGuard)
  marquerLu(@Param('id') id: string, @Request() req) {
    const adminEmail = req.user?.email;
    return this.commandesOnlineService.marquerLu(+id, adminEmail);
  }

  @Put(':id/traiter')
  @UseGuards(JwtAuthGuard)
  traiterCommande(
    @Param('id') id: string, 
    @Body() traiterDto: TraiterCommandeDto,
    @Request() req
  ) {
    const adminEmail = req.user?.email;
    return this.commandesOnlineService.traiterCommande(+id, traiterDto, adminEmail);
  }

  @Put(':id/annuler')
  @UseGuards(JwtAuthGuard)
  annulerCommande(
    @Param('id') id: string, 
    @Body() annulerDto: AnnulerCommandeDto,
    @Request() req
  ) {
    const adminEmail = req.user?.email;
    return this.commandesOnlineService.annulerCommande(+id, annulerDto, adminEmail);
  }

  @Put(':id/envoyer-email-reception')
  @UseGuards(JwtAuthGuard)
  envoyerEmailReception(@Param('id') id: string) {
    return this.commandesOnlineService.envoyerEmailReception(+id);
  }

  @Put(':id/renvoyer-email')
  @UseGuards(JwtAuthGuard)
  renvoyerEmailTraitement(@Param('id') id: string) {
    return this.commandesOnlineService.renvoyerEmailTraitement(+id);
  }

  // Ancienne méthode pour compatibilité
  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  annuler(@Param('id') id: string, @Request() req) {
    const adminEmail = req.user?.email;
    const annulerDto: AnnulerCommandeDto = {
      raison_annulation: 'Annulation via interface admin',
      envoyer_email: true
    };
    return this.commandesOnlineService.annulerCommande(+id, annulerDto, adminEmail);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commandesOnlineService.remove(+id);
  }
}