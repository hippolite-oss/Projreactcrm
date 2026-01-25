import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('clients-growth')
  getClientsGrowth() {
    return this.dashboardService.getClientsGrowth();
  }

  @Get('revenue')
  getRevenue() {
    return this.dashboardService.getRevenue();
  }

  @Get('client-status')
  getClientStatus() {
    return this.dashboardService.getClientStatus();
  }

  @Get('recent-activities')
  getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }

  @Get('notifications')
  getNotifications() {
    return this.dashboardService.getNotifications();
  }

  @Get('top-products')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }
}

