import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Contact> {
    return this.contactsRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async create(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.contactsRepository.create(contactData);
    return this.contactsRepository.save(contact);
  }

  async update(id: number, contactData: Partial<Contact>): Promise<Contact> {
    await this.contactsRepository.update(id, contactData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.contactsRepository.delete(id);
  }
}

