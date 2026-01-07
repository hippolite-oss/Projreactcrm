import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoicesRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoicesRepository.create(invoiceData);
    return this.invoicesRepository.save(invoice);
  }

  async update(id: number, invoiceData: Partial<Invoice>): Promise<Invoice> {
    await this.invoicesRepository.update(id, invoiceData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.invoicesRepository.delete(id);
  }
}

