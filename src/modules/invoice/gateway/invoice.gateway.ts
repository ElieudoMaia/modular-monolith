import { Invoice } from '../domain/invoice.entity';

export interface InvoiceGateway {
  find(id: string): Promise<Invoice | null>
  generate(invoice: Invoice): Promise<void>
}
