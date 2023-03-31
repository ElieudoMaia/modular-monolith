import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { Product } from "../../domain/product.entity";
import { ProductGateway } from "../../gateway/product.gateway";
import { FindAllProductsUseCase } from './find-all-products.usecase';

const product1 = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});
const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  description: "Product 2 description",
  salesPrice: 200,
});

const makeProductGatewayMock = (): ProductGateway => {
  return {
    findAll: jest.fn().mockResolvedValue([product1, product2]),
    find: jest.fn(),
  };
};

describe("FindAllProducts usecase", () => {
  test("should find the products", async () => {
    const productGateway = makeProductGatewayMock();
    const findAllProductsUseCase = new FindAllProductsUseCase(productGateway);
    const output = await findAllProductsUseCase.execute();
    expect(productGateway.findAll).toHaveBeenCalledTimes(1);
    expect(output.products[0].id).toEqual(product1.id.value);
    expect(output.products[0].name).toEqual(product1.name);
    expect(output.products[0].description).toEqual(product1.description);
    expect(output.products[0].salesPrice).toEqual(product1.salesPrice);
    expect(output.products[1].id).toEqual(product2.id.value);
    expect(output.products[1].name).toEqual(product2.name);
    expect(output.products[1].description).toEqual(product2.description);
    expect(output.products[1].salesPrice).toEqual(product2.salesPrice);
  });
});
