import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import { StoreCatalogFacadeFactory } from "../factory/facade.factory";

describe("", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  test("should find a product", async () => {
    const product = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    };
    await ProductModel.create(product);
    const facade = StoreCatalogFacadeFactory.create();
    const foundProduct = await facade.findProduct({ id: "1" });
    expect(foundProduct).toEqual(product);
  });

  test("should find all products", async () => {
    const product1 = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    };
    const product2 = {
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 20,
    };
    await ProductModel.create(product1);
    await ProductModel.create(product2);
    const facade = StoreCatalogFacadeFactory.create();
    const foundProducts = await facade.findAllProducts();
    expect(foundProducts.products).toEqual([product1, product2]);
  })
});
