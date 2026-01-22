import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    return this.clientsRepository.findOne({ where: { id } });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.clientsRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}

