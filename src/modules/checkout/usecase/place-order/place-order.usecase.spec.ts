import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { ClientFacadeInterface } from "../../../client-adm/facade/client-adm.facade.interface";
import { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import { ProductAdmFacadeInterface } from "../../../product-adm/facade/product-adm.facade.interface";
import { StoreCatalogFacadeInterface } from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Product } from "../../domain/product.entity";
import { CheckoutGateway } from "../../gateway/checkout.gateway";
import { PlaceOrderUseCase } from "./place-order.usecase";
import { PlaceOrderUseCaseInputDTO } from "./place-order.usecase.dto";

type SutTypes = {
  sut: PlaceOrderUseCase;
  mockClientFacade: ClientFacadeInterface;
  mockProductFacade: ProductAdmFacadeInterface;
  mockStoreCatalogFacade: StoreCatalogFacadeInterface;
  mockCheckoutRepository: CheckoutGateway;
  mockPaymentFacade: PaymentFacadeInterface;
  mockInvoiceFacade: InvoiceFacadeInterface;
};

const makeSut = (): SutTypes => {
  const mockClientFacade: ClientFacadeInterface = {
    addClient: jest.fn(),
    findClient: jest.fn().mockResolvedValue({
      id: "1",
      name: "Any  name",
      email: "any@mail.com",
      address: "Any address",
      createdAt: Date.now,
      updatedAt: Date.now,
    }),
  };
  const mockProductFacade: ProductAdmFacadeInterface = {
    addProduct: jest.fn(),
    checkStock: jest.fn().mockImplementation(({ productId }) => {
      return Promise.resolve({
        productId,
        stock: productId === "1" ? 0 : 1,
      });
    }),
  };
  const mockStoreCatalogFacade: StoreCatalogFacadeInterface = {
    findAllProducts: jest.fn(),
    findProduct: jest.fn().mockImplementation(({ id }) => {
      return Promise.resolve({
        id,
        name: "Any name",
        description: "Any description",
        salesPrice: 10,
      });
    }),
  };
  const mockCheckoutRepository: CheckoutGateway = {
    addOrder: jest.fn(),
    findOrder: jest.fn(),
  };
  const mockInvoiceFacade: InvoiceFacadeInterface = {
    findInvoice: jest.fn(),
    generateInvoice: jest.fn().mockResolvedValue({ id: "1e" }),
  };
  const mockPaymentFacade: PaymentFacadeInterface = {
    processPayment: jest.fn().mockResolvedValue({
      transactionId: "1t",
      orderId: "1o",
      amount: 100,
      status: "error",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  };

  const placeOrderUseCase = new PlaceOrderUseCase(
    mockClientFacade,
    mockProductFacade,
    mockStoreCatalogFacade,
    mockCheckoutRepository,
    mockPaymentFacade,
    mockInvoiceFacade
  );

  return {
    sut: placeOrderUseCase,
    mockClientFacade,
    mockProductFacade,
    mockStoreCatalogFacade,
    mockCheckoutRepository,
    mockPaymentFacade,
    mockInvoiceFacade,
  };
};

const mockDate = new Date("2023-03-30T00:00:00.000Z");

describe("PlaceOrder use case unit tests", () => {
  describe("validateProducts method", () => {
    test("should throw a error when no products are selected", async () => {
      const { sut } = makeSut();

      const validateProductsSpy = jest.spyOn(sut as any, "validateProducts");

      const input: PlaceOrderUseCaseInputDTO = {
        clientId: "1",
        products: [],
      };

      await expect(sut.execute(input)).rejects.toThrow("No products selected");
      expect(validateProductsSpy).toHaveBeenCalledTimes(1);
      expect(validateProductsSpy).toHaveBeenCalledWith(input);
    });

    test("should not throw when products are valid", async () => {
      const { sut } = makeSut();

      const validateProductsSpy = jest.spyOn(sut as any, "validateProducts");

      const input: PlaceOrderUseCaseInputDTO = {
        clientId: "2",
        products: [{ productId: "any valid id" }],
      };

      await expect(sut.execute(input)).resolves.not.toThrow();
      expect(validateProductsSpy).toHaveBeenCalledTimes(1);
      expect(validateProductsSpy).toHaveBeenCalledWith(input);
    });

    test("should throw a error when product is out of stock", async () => {
      const { sut, mockProductFacade } = makeSut();

      let input: PlaceOrderUseCaseInputDTO = {
        clientId: "1",
        products: [{ productId: "1" }],
      };

      await expect(sut.execute(input)).rejects.toThrow(
        "Product 1 is not available in stock"
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(1);

      input = {
        clientId: "1",
        products: [{ productId: "2" }, { productId: "3" }],
      };

      await expect(sut.execute(input)).resolves.not.toThrow();
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      };
      await expect(sut.execute(input)).rejects.toThrow(
        "Product 1 is not available in stock"
      );
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test("should throw a error when a product was not found", async () => {
      const { sut, mockStoreCatalogFacade } = makeSut();
      jest
        .spyOn(mockStoreCatalogFacade, "findProduct")
        .mockResolvedValueOnce(null);

      expect(sut["getProduct"]("10")).rejects.toThrow("Product not found");
      expect(mockStoreCatalogFacade.findProduct).toHaveBeenCalledTimes(1);
      expect(mockStoreCatalogFacade.findProduct).toHaveBeenCalledWith({
        id: "10",
      });
    });

    test("should return a product when it was found", async () => {
      const { sut, mockStoreCatalogFacade } = makeSut();
      const product = await sut["getProduct"]("10");
      expect(product).toEqual(
        new Product({
          id: new Id("10"),
          name: "Any name",
          description: "Any description",
          salesPrice: 10,
        })
      );
      expect(mockStoreCatalogFacade.findProduct).toHaveBeenCalledTimes(1);
      expect(mockStoreCatalogFacade.findProduct).toHaveBeenCalledWith({
        id: "10",
      });
    });
  });

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test("should throw a error when client was not found", async () => {
      const { sut, mockClientFacade } = makeSut();
      jest.spyOn(mockClientFacade, "findClient").mockResolvedValueOnce(null);

      const input: PlaceOrderUseCaseInputDTO = {
        clientId: "1",
        products: [],
      };

      await expect(sut.execute(input)).rejects.toThrow("Client not found");
    });

    test("should throw a error on product validation fails", async () => {
      const { sut } = makeSut();

      const validateProductsSpy = jest
        .spyOn(sut as any, "validateProducts")
        .mockRejectedValueOnce(new Error("Test Error"));

      const input: PlaceOrderUseCaseInputDTO = {
        clientId: "1",
        products: [],
      };

      await expect(sut.execute(input)).rejects.toThrow("Test Error");
      expect(validateProductsSpy).toHaveBeenCalledTimes(1);
      expect(validateProductsSpy).toHaveBeenCalledWith(input);
    });

    describe("place a order", () => {
      const clientProps = {
        id: "1c",
        name: "Any name",
        document: "00001",
        email: "any@mail.com",
        street: "Any street",
        number: "10",
        complement: "Any complement",
        city: "Any city",
        state: "Any state",
        zipCode: "00000-000",
      };

      const fakeProducts = {
        "10": new Product({
          id: new Id("10"),
          name: "Any name",
          description: "Any description",
          salesPrice: 10,
        }),
        "20": new Product({
          id: new Id("20"),
          name: "Any name 2",
          description: "Any description 2",
          salesPrice: 20,
        }),
      };

      test("should not be approved", async () => {
        const {
          sut,
          mockClientFacade,
          mockCheckoutRepository,
          mockPaymentFacade,
          mockInvoiceFacade,
        } = makeSut();

        const validateProductsSpy = jest
          .spyOn(sut as any, "validateProducts")
          .mockResolvedValueOnce(null);

        const mockGetProduct = jest
          .spyOn(sut as any, "getProduct")
          .mockImplementation(
            (productId: unknown): any => {
              console.log("######" + productId);
              if (productId === "10" || productId === "20") {
                return Promise.resolve(
                  fakeProducts[productId]
                );
              }
            }
          );

        const input: PlaceOrderUseCaseInputDTO = {
          clientId: "1c",
          products: [{ productId: "10" }, { productId: "20" }],
        };

        let output = await sut.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(30);
        expect(output.products).toStrictEqual([
          {
            productId: "10",
          },
          {
            productId: "20",
          },
        ]);
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: "1c" });
        expect(validateProductsSpy).toHaveBeenCalledTimes(1);
        expect(validateProductsSpy).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockGetProduct).toHaveBeenNthCalledWith(1, "10");
        expect(mockGetProduct).toHaveBeenNthCalledWith(2, "20");
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
          orderId: expect.any(String),
          amount: 30,
        });
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(0);
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(0);
      });

      test("should be approved", async () => {
        const {
          sut,
          mockClientFacade,
          mockCheckoutRepository,
          mockPaymentFacade,
          mockInvoiceFacade,
        } = makeSut();

        jest.spyOn(mockPaymentFacade, "processPayment").mockResolvedValueOnce({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const validateProductsSpy = jest
          .spyOn(sut as any, "validateProducts")
          .mockResolvedValueOnce(null);

        const mockGetProduct = jest
          .spyOn(sut as any, "getProduct")
          .mockImplementation(
            (productId: unknown): any => {
              if (productId === "10" || productId === "20") {
                return Promise.resolve(
                  fakeProducts[productId]
                );
              }
            }
          );

        const input: PlaceOrderUseCaseInputDTO = {
          clientId: "1c",
          products: [{ productId: "10" }, { productId: "20" }],
        };

        let output = await sut.execute(input);

        expect(output.invoiceId).toBe("1e");
        expect(output.total).toBe(30);
        expect(output.products).toStrictEqual([
          {
            productId: "10",
          },
          {
            productId: "20",
          },
        ]);
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: "1c" });
        expect(validateProductsSpy).toHaveBeenCalledTimes(1);
        expect(validateProductsSpy).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockGetProduct).toHaveBeenNthCalledWith(1, "10");
        expect(mockGetProduct).toHaveBeenNthCalledWith(2, "20");
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
          orderId: expect.any(String),
          amount: 30,
        });
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1);
      });
    });
  });
});
