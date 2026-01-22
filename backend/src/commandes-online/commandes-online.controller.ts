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
} from '@nestjs/common';
import { CommandesOnlineService } from './commandes-online.service';
import { CreateCommandeOnlineDto } from './dto/create-commande-online.dto';
import { UpdateCommandeOnlineDto } from './dto/update-commande-online.dto';
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
  marquerLu(@Param('id') id: string) {
    return this.commandesOnlineService.marquerLu(+id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  annuler(@Param('id') id: string) {
    return this.commandesOnlineService.annuler(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commandesOnlineService.remove(+id);
  }
}