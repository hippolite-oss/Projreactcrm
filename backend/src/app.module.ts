import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProductsModule } from './products/products.module';
import { QuotesModule } from './quotes/quotes.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './users/entities/user.entity';
import { Client } from './clients/entities/client.entity';
import { Contact } from './contacts/entities/contact.entity';
import { Product } from './products/entities/product.entity';
import { Quote } from './quotes/entities/quote.entity';
import { Invoice } from './invoices/entities/invoice.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '0000',
      database: process.env.DB_DATABASE || 'crm',
      entities: [User, Client, Contact, Product, Quote, Invoice],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    ContactsModule,
    ProductsModule,
    QuotesModule,
    InvoicesModule,
    DashboardModule,
  ],
})
export class AppModule {}

