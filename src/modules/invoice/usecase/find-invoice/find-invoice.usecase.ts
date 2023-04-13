import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto";
import { FindInvoiceUseCaseInterface } from './find-invoice.usecase.interface.dto';

export class FindInvoiceUseCase implements FindInvoiceUseCaseInterface {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id);
    if (!invoice) throw new Error("Invoice not found");

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      address: {
        city: invoice.address.city,
        state: invoice.address.state,
        street: invoice.address.street,
        complement: invoice.address.complement,
        number: invoice.address.number,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price
      })),
      total: 0,
      createdAt: invoice.createdAt,
    }
  }
}
