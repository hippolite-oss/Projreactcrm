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
}

