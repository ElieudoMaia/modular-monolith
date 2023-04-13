import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { Address } from "../../domain/address.value-object";
import { Invoice } from "../../domain/invoice.entity";
import { Product } from "../../domain/product.entity";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("any_id"),
  name: "any_name",
  address: new Address({
    state: "any_state",
    city: "any_city",
    street: "any_street",
    number: "any_number",
    complement: "any_complement",
    zipCode: "any_zipCode",
  }),
  document: "any_document",
  items: [
    new Product({
      id: new Id("any_id"),
      name: "any_name",
      price: 10,
    }),
  ],
});

const makeMockInvoiceRepository = (): InvoiceGateway => ({
  find: jest.fn().mockResolvedValue(invoice),
  generate: jest.fn(),
});

describe("FindInvoiceUseCase tests", () => {
  test("should call invoiceRepository.find with correct value", async () => {
    const invoiceRepository = makeMockInvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    await findInvoiceUseCase.execute({ id: "any_id" });
    expect(invoiceRepository.find).toHaveBeenCalledWith("any_id");
  });

  test("should throw an error if invoice was not found", async () => {
    const invoiceRepository = makeMockInvoiceRepository();
    invoiceRepository.find = jest.fn().mockResolvedValue(undefined);
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    await expect(findInvoiceUseCase.execute({ id: "any_id" })).rejects.toThrow(
      "Invoice not found"
    );
  });

  test("should find a invoice", async () => {
    const invoiceRepository = makeMockInvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    const result = await findInvoiceUseCase.execute({ id: "any_id" });
    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id.value);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address).toEqual({
      city: invoice.address.city,
      state: invoice.address.state,
      street: invoice.address.street,
      complement: invoice.address.complement,
      number: invoice.address.number,
      zipCode: invoice.address.zipCode,
    });
    expect(result.items).toEqual(
      invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      }))
    );
  });
});
