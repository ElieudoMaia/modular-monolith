import { Product } from "../domain/product.entity";
import { ProductGateway } from '../gateway/product.gateway';
import { AddProductUsecase } from './add-product.usecase';

const makeProductGatewayMock = (): ProductGateway => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add product usecase unit test", () => {
  test("should add a product", async () => {
    const productGateway = makeProductGatewayMock();
    const usecase = new AddProductUsecase(productGateway);

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    const result = await usecase.execute(input);

    expect(productGateway.add).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.purchasePrice).toBe(input.purchasePrice);
    expect(result.stock).toBe(input.stock);
  });
});
