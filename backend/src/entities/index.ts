// Export all entities for easy import
export { User, UserRole } from '../users/entities/user.entity';
export { Client } from '../clients/entities/client.entity';
export { Contact } from '../contacts/entities/contact.entity';
export { Product, ProductUnit } from '../products/entities/product.entity';
export { Quote, QuoteStatus } from '../quotes/entities/quote.entity';
export { QuoteItem } from '../quotes/entities/quote-item.entity';
export { Invoice, InvoiceStatus } from '../invoices/entities/invoice.entity';
export { InvoiceItem } from '../invoices/entities/invoice-item.entity';

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
];