import { Controller, Get } from '@nestjs/common';

@Controller('parametres')
export class ParametresController {
  @Get()
  getParametres() {
    return {
      success: true,
      data: {
        nom_societe: 'Quincaillerie Pro',
        adresse: '123 Rue de l\'Industrie',
        ville: 'Paris',
        code_postal: '75001',
        telephone: '01 23 45 67 89',
        email: 'contact@quincaillerie-pro.fr',
        siret: '12345678901234',
        tva: 'FR12345678901'
      }
    };
  }
}