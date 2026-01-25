// Import all entities
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Product } from '../products/entities/product.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { QuoteItem } from '../quotes/entities/quote-item.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceItem } from '../invoices/entities/invoice-item.entity';
import { CommandeOnline } from '../commandes-online/entities/commande-online.entity';
import { Prospect } from '../prospects/entities/prospect.entity';
import { Category } from '../categories/entities/category.entity';

// Export all entities for easy import
export { User } from '../users/entities/user.entity';
export { UserRole } from '../users/entities/user.entity';
export { Client } from '../clients/entities/client.entity';
export { Contact } from '../contacts/entities/contact.entity';
export { Product } from '../products/entities/product.entity';
export { ProductUnit, ProductCategory } from '../products/entities/product.entity';
export { Quote } from '../quotes/entities/quote.entity';
export { QuoteStatus } from '../quotes/entities/quote.entity';
export { QuoteItem } from '../quotes/entities/quote-item.entity';
export { Invoice } from '../invoices/entities/invoice.entity';
export { InvoiceStatus } from '../invoices/entities/invoice.entity';
export { InvoiceItem } from '../invoices/entities/invoice-item.entity';
export { CommandeOnline } from '../commandes-online/entities/commande-online.entity';
export { CommandeOnlineStatus } from '../commandes-online/entities/commande-online.entity';
export { Prospect } from '../prospects/entities/prospect.entity';
export { ProspectStatus } from '../prospects/entities/prospect.entity';
export { Category } from '../categories/entities/category.entity';
export { CategoryStatus } from '../categories/entities/category.entity';

// Array of all entities for TypeORM configuration
export const entities = [
  User,
  Client,
  Contact,
  Product,
  Quote,
  QuoteItem,
  Invoice,
  InvoiceItem,
  CommandeOnline,
  Prospect,
  Category,
];