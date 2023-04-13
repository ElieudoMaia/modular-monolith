import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Address } from "../domain/address.value-object";
import { Invoice } from "../domain/invoice.entity";
import { Product } from "../domain/product.entity";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import { AddressModel } from "./address.model";
import { InvoiceModel } from "./invoice.model";

export class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice | null> {
    const result = await InvoiceModel.findOne({
      where: { id },
      include: ["address", "products"],
    });
    if (!result) return null;

    const address = new Address({
      city: result.address.city,
      complement: result.address.complement,
      number: result.address.number,
      state: result.address.state,
      street: result.address.street,
      zipCode: result.address.zipCode,
    });

    const items = result.products.map((prod) => {
      return new Product({
        id: new Id(prod.id),
        name: prod.name,
        price: prod.price,
      });
    });

    const invoice = new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address,
      items,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });

    return invoice;
  }

  async generate(invoice: Invoice): Promise<void> {
    const products = invoice.items.map((item) => {
      return {
        id: item.id.value,
        name: item.name,
        price: item.price
      };
    });

    await InvoiceModel.create(
      {
        id: invoice.id.value,
        name: invoice.name,
        document: invoice.document,
        products,
        address: {
          invoiceId: invoice.id.value,
          street: invoice.address.street,
          number: invoice.address.number,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
          complement: invoice.address.complement,
        },
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      { include: ["address", "products"] }
    );
  }
}
