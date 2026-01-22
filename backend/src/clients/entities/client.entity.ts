import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Contact } from '../../contacts/entities/contact.entity';
import { Quote } from '../../quotes/entities/quote.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('clients')
@Index(['email'])
@Index(['name'])
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 20 })
  postalCode: string;

  @Column({ nullable: true, length: 100 })
  country: string;

  // Relations
  @OneToMany(() => Contact, (contact) => contact.client)
  contacts: Contact[];

  @OneToMany(() => Quote, (quote) => quote.client)
  quotes: Quote[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

