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
import { CommandesOnlineModule } from './commandes-online/commandes-online.module';
import { ProspectsModule } from './prospects/prospects.module';
import { EmailModule } from './email/email.module';
import { ParametresModule } from './parametres/parametres.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { I18nModule } from './i18n/i18n.module';
import { entities } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: entities,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    ContactsModule,
    ProductsModule,
    QuotesModule,
    InvoicesModule,
    DashboardModule,
    CommandesOnlineModule,
    ProspectsModule,
    EmailModule,
    ParametresModule,
    CategoriesModule,
    ReportsModule,
    I18nModule,
  ],
})
export class AppModule {}
