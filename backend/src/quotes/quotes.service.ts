import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
  ) {}

  async findAll(): Promise<Quote[]> {
    return this.quotesRepository.find({
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Quote> {
    return this.quotesRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async create(quoteData: Partial<Quote>): Promise<Quote> {
    const quote = this.quotesRepository.create(quoteData);
    return this.quotesRepository.save(quote);
  }

  async update(id: number, quoteData: Partial<Quote>): Promise<Quote> {
    await this.quotesRepository.update(id, quoteData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.quotesRepository.delete(id);
  }
}

