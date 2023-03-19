import { ProductGateway } from "../../gateway/product.gateway";
import { CheckStockUseCase } from "./check-stock.usecase";

const makeProductGatewayMock = (): ProductGateway => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };
};

describe("CheckStock unit tests", () => {
  test("should return the stock", async () => {
    const checkStockUseCase = new CheckStockUseCase(makeProductGatewayMock());
    const output = await checkStockUseCase.execute({ productId: "1" });
    expect(output).toBeDefined();
    expect(output.stock).toBe(10);
  });

  test("should throw an error if the product does not exist", async () => {
    const mockedRepository = makeProductGatewayMock();
    mockedRepository.find = jest
      .fn()
      .mockRejectedValueOnce(new Error("Product with id 2 not found"));
    const checkStockUseCase = new CheckStockUseCase(mockedRepository);
    await expect(
      checkStockUseCase.execute({ productId: "2" })
    ).rejects.toThrowError("Product with id 2 not found");
  });
});
