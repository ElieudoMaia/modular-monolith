import { Sequelize } from "sequelize-typescript";
import { AddressModel } from "../repository/address.model";
import { InvoiceModel } from "../repository/invoice.model";
import { ProductModel } from "../repository/product.model";
import { InvoiceFacadeFactory } from '../factory/invoice.factory';
import { GenerateInvoiceFacadeInputDTO } from './invoice.facade.interface';

describe("Invoice facade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([AddressModel, ProductModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  test("should create a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input: GenerateInvoiceFacadeInputDTO = {
      name: "John Doe",
      document: "12345678901",
      city: "São Paulo",
      state: "SP",
      street: "Rua 1",
      number: "123",
      zipCode: "12345678",
      complement: "Apto 1",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
      ],
    };

    const result = await facade.generateInvoice(input);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();

    const modelResult = await InvoiceModel.findOne({
      where: { id: result.id },
      include: ["address", "products"],
    });

    expect(modelResult).toBeDefined();
    expect(modelResult?.id).toBe(result.id);
    expect(modelResult?.name).toBe(input.name);
    expect(modelResult?.document).toBe(input.document);
    expect(modelResult?.products).toBeDefined();
    expect(modelResult?.products.length).toBe(1);
    expect(modelResult?.products[0].id).toBe(input.items[0].id);
    expect(modelResult?.products[0].name).toBe(input.items[0].name);
    expect(modelResult?.products[0].price).toBe(input.items[0].price);
    expect(modelResult?.address).toBeDefined();
    expect(modelResult?.address.city).toBe(input.city);
    expect(modelResult?.address.state).toBe(input.state);
    expect(modelResult?.address.number).toBe(input.number);
    expect(modelResult?.address.street).toBe(input.street);
    expect(modelResult?.address.zipCode).toBe(input.zipCode);
    expect(modelResult?.address.complement).toBe(input.complement);
  });

  test("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const invoice = await InvoiceModel.create(
      {
        id: "123",
        name: "Any name",
        document: "Any document",
        products: [{
          id: "123",
          name: "Any name",
          price: 10,
        }],
        address: {
          invoiceId: "123",
          street: "Any street",
          number: "Any number",
          city: "Any city",
          state: "Any state",
          zipCode: "Any zipCode",
          complement: "Any complement",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: ["address", "products"] }
    );

    const result = await facade.findInvoice({ id: invoice.id });

    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.items).toBeDefined();
    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe(invoice.products[0].id);
    expect(result.items[0].name).toBe(invoice.products[0].name);
    expect(result.items[0].price).toBe(invoice.products[0].price);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.address.complement).toBe(invoice.address.complement);
  });
});
