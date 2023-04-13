import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { Address } from "../../domain/address.value-object";
import { Invoice } from "../../domain/invoice.entity";
import { Product } from "../../domain/product.entity";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDTO,
  GenerateInvoiceUseCaseOutputDTO,
} from "./generate-invoice.usecase.dto";
import { GenerateInvoiceUseCaseInterface } from "./generate-invoice.usecase.interface";

export class GenerateInvoiceUseCase implements GenerateInvoiceUseCaseInterface {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDTO
  ): Promise<GenerateInvoiceUseCaseOutputDTO> {
    const products = input.items.map((item) => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      });
    });

    const address = new Address({
      state: input.state,
      city: input.city,
      complement: input.complement,
      number: input.number,
      street: input.street,
      zipCode: input.zipCode,
    });

    const invoice = new Invoice({
      id: new Id(),
      name: input.name,
      address,
      document: input.document,
      items: products,
      createdAt: new Date(),
    });

    await this.invoiceRepository.generate(invoice);

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      city: invoice.address.city,
      state: invoice.address.state,
      complement: invoice.address.complement,
      number: invoice.address.number,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      total: invoice.total,
    };
  }
}
