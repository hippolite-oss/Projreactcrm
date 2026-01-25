import { Controller, Get, Query, UseGuards, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboardStats(@Query('period') period: string = 'month') {
    return this.reportsService.getDashboardStats(period);
  }

  @Get('sales')
  async getSalesReport(@Query('period') period: string = 'month') {
    return this.reportsService.getSalesReport(period);
  }

  @Get('clients')
  async getClientsReport(@Query('period') period: string = 'month') {
    return this.reportsService.getClientsReport(period);
  }

  @Get('products')
  async getProductsReport(@Query('period') period: string = 'month') {
    return this.reportsService.getProductsReport(period);
  }

  @Get('revenue')
  async getRevenueReport(@Query('period') period: string = 'month') {
    return this.reportsService.getRevenueReport(period);
  }

  @Get('overview')
  async getOverviewReport(@Query('period') period: string = 'month') {
    return this.reportsService.getOverviewReport(period);
  }

  @Post('export/pdf')
  async exportToPDF(
    @Body() exportData: any,
    @Res() res: Response,
    @Query('period') period: string = 'month'
  ) {
    try {
      const reportData = await this.reportsService.getDashboardStats(period);
      const pdfBuffer = await this.reportsService.generatePDFReport(reportData, exportData);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rapport-crm-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
    }
  }

  @Get('export/excel')
  async exportToExcel(
    @Res() res: Response,
    @Query('period') period: string = 'month'
  ) {
    try {
      const reportData = await this.reportsService.getDashboardStats(period);
      const excelBuffer = await this.reportsService.generateExcelReport(reportData);
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="rapport-crm-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Length': excelBuffer.length,
      });
      
      res.end(excelBuffer);
    } catch (error) {
      console.error('Erreur génération Excel:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du fichier Excel' });
    }
  }
}