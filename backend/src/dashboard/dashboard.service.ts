import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async getStats() {
    const [clients, products, quotes, invoices] = await Promise.all([
      this.clientsRepository.count(),
      this.productsRepository.count(),
      this.quotesRepository.count(),
      this.invoicesRepository.count(),
    ]);

    const invoicesData = await this.invoicesRepository.find();
    const revenue = invoicesData.reduce((sum, invoice) => {
      return sum + Number(invoice.paidAmount);
    }, 0);

    // Calcul de croissance (exemple simplifié)
    const growth = 12.5;

    return {
      clients,
      products,
      quotes,
      invoices,
      revenue,
      growth,
    };
  }

  async getClientsGrowth() {
    // Données simulées pour la croissance des clients
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const data = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      data.push({
        month: months[monthIndex],
        clients: Math.floor(Math.random() * 50) + 20,
        prospects: Math.floor(Math.random() * 30) + 10
      });
    }
    
    return { success: true, data };
  }

  async getRevenue() {
    // Données simulées pour les revenus
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const data = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      data.push({
        month: months[monthIndex],
        revenue: Math.floor(Math.random() * 50000) + 20000,
        target: 45000
      });
    }
    
    return { success: true, data };
  }

  async getClientStatus() {
    // Données simulées pour le statut des clients
    const totalClients = await this.clientsRepository.count();
    
    return {
      success: true,
      data: {
        actifs: Math.floor(totalClients * 0.7),
        inactifs: Math.floor(totalClients * 0.2),
        prospects: Math.floor(totalClients * 0.1)
      }
    };
  }
}

