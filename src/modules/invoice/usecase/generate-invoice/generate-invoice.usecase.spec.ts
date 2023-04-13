import { InvoiceGateway } from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const makeMockInvoiceRepository = (): InvoiceGateway => ({
  find: jest.fn(),
  generate: jest.fn(),
});

describe("GenerateInvoiceUseCase unit tests", () => {
  test("should call invoiceRepository with correct values and generate invoice", async () => {
    const invoiceRepository = makeMockInvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );

    const result = await generateInvoiceUseCase.execute({
      name: "any_name",
      document: "any_document",
      state: "any_state",
      city: "any_city",
      street: "any_street",
      number: "any_number",
      complement: "any_complement",
      zipCode: "any_zipCode",
      items: [
        {
          id: "any_id",
          name: "any_name",
          price: 10,
        },
      ],
    });

    expect(invoiceRepository.generate).toHaveBeenCalledTimes(1);
    expect(result.city).toBe("any_city");
    expect(result.complement).toBe("any_complement");
    expect(result.document).toBe("any_document");
    expect(result.id).toBeTruthy();
    expect(result.name).toBe("any_name");
    expect(result.number).toBe("any_number");
    expect(result.state).toBe("any_state");
    expect(result.street).toBe("any_street");
    expect(result.zipCode).toBe("any_zipCode");
    expect(result.total).toBeTruthy();
    expect(result.items).toEqual([
      {
        id: "any_id",
        name: "any_name",
        price: 10,
      },
    ]);
  });

  test("should throw an error if invoiceRepository throws", async () => {
    const invoiceRepository = makeMockInvoiceRepository();
    invoiceRepository.generate = jest
      .fn()
      .mockRejectedValue(new Error("any error"));
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );
    await expect(
      generateInvoiceUseCase.execute({
        name: "any_name",
        document: "any_document",
        state: "any_state",
        city: "any_city",
        street: "any_street",
        number: "any_number",
        complement: "any_complement",
        zipCode: "any_zipCode",
        items: [
          {
            id: "any_id",
            name: "any_name",
            price: 10,
          },
        ],
      })
    ).rejects.toThrow("any error");
  });
});
