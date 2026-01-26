import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  /**
   * Récupérer toutes les langues disponibles
   */
  @Get('languages')
  async getAvailableLanguages() {
    return this.i18nService.getAvailableLanguages();
  }

  /**
   * Récupérer les traductions pour une langue
   */
  @Get('translations/:lang')
  async getTranslations(@Param('lang') lang: string) {
    return this.i18nService.getTranslations(lang);
  }

  /**
   * Mettre à jour les préférences de langue utilisateur
   */
  @Post('user-preference')
  async updateUserLanguagePreference(@Body() body: { language: string, userId?: number }) {
    return this.i18nService.updateUserLanguagePreference(body.language, body.userId);
  }

  /**
   * Récupérer la langue préférée de l'utilisateur
   */
  @Get('user-preference/:userId')
  async getUserLanguagePreference(@Param('userId') userId: number) {
    return this.i18nService.getUserLanguagePreference(userId);
  }
}