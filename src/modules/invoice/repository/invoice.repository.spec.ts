import { Sequelize } from "sequelize-typescript";
import { InvoiceRepository } from "./invoice.repository";
import { GenerateInvoiceUseCase } from "../usecase/generate-invoice/generate-invoice.usecase";
import { AddressModel } from "./address.model";
import { ProductModel } from "./product.model";
import { InvoiceModel } from "./invoice.model";
import { FindInvoiceUseCase } from '../usecase/find-invoice/find-invoice.usecase';

describe("FindInvoice repository tests", () => {
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
    const invoiceRepository = new InvoiceRepository();
    const invoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

    const invoice = await invoiceUseCase.execute({
      name: "Teste",
      document: "123456789",
      items: [
        {
          id: "123",
          name: "Teste",
          price: 10,
        },
      ],
      city: "São Paulo",
      state: "SP",
      number: "123",
      street: "Rua teste",
      zipCode: "12345678",
      complement: "Teste complemento",
    });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe("Teste");
    expect(invoice.document).toBe("123456789");
    expect(invoice.items).toBeDefined();
    expect(invoice.items.length).toBe(1);
    expect(invoice.items[0].id).toBeDefined();
    expect(invoice.items[0].name).toBe("Teste");
    expect(invoice.items[0].price).toBe(10);
    expect(invoice.city).toBe("São Paulo");
    expect(invoice.state).toBe("SP");
    expect(invoice.number).toBe("123");
    expect(invoice.street).toBe("Rua teste");
    expect(invoice.zipCode).toBe("12345678");
    expect(invoice.complement).toBe("Teste complemento");

    const modelResult = await InvoiceModel.findOne({
      where: { id: invoice.id },
      include: ["address", "products"],
    });

    expect(modelResult).toBeDefined();
    expect(modelResult?.id).toBe(invoice.id);
    expect(modelResult?.name).toBe(invoice.name);
    expect(modelResult?.document).toBe(invoice.document);
    expect(modelResult?.products).toBeDefined();
    expect(modelResult?.products.length).toBe(1);
    expect(modelResult?.products[0].id).toBe(invoice.items[0].id);
    expect(modelResult?.products[0].name).toBe(invoice.items[0].name);
    expect(modelResult?.products[0].price).toBe(invoice.items[0].price);
    expect(modelResult?.address).toBeDefined();
    expect(modelResult?.address.city).toBe(invoice.city);
    expect(modelResult?.address.state).toBe(invoice.state);
    expect(modelResult?.address.number).toBe(invoice.number);
    expect(modelResult?.address.street).toBe(invoice.street);
    expect(modelResult?.address.zipCode).toBe(invoice.zipCode);
    expect(modelResult?.address.complement).toBe(invoice.complement);
  });

  test("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
    const invoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

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

    const result = await invoiceUseCase.execute({ id: invoice.id });

    expect(result).toBeDefined();
    expect(result?.id).toBe(invoice.id);
    expect(result?.name).toBe(invoice.name);
    expect(result?.document).toBe(invoice.document);
    expect(result?.items).toBeDefined();
    expect(result?.items.length).toBe(1);
    expect(result?.items[0].id).toBe(invoice.products[0].id);
    expect(result?.items[0].name).toBe(invoice.products[0].name);
    expect(result?.items[0].price).toBe(invoice.products[0].price);
    expect(result?.address.city).toBe(invoice.address.city);
    expect(result?.address.state).toBe(invoice.address.state);
    expect(result?.address.number).toBe(invoice.address.number);
    expect(result?.address.street).toBe(invoice.address.street);
    expect(result?.address.zipCode).toBe(invoice.address.zipCode);
    expect(result?.address.complement).toBe(invoice.address.complement);
  });
});
