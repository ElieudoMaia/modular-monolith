import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import { ProductRepository } from "../repository/product.repository";
import { AddProductUsecase } from "../usecase/add-product.usecase";
import { ProductAdmFacade } from "./product-adm.facade";

describe("ProductAdmFacade integration test", () => {
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

  test("should create a product", async () => {
    const productRepository = new ProductRepository();
    const addproductUsecase = new AddProductUsecase(productRepository);
    const productFacade = new ProductAdmFacade({
      addproductUsecase,
      checkStockUsecase: { execute: jest.fn() },
    });
    await productFacade.addProduct({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    const productDb = await ProductModel.findOne({
      where: { id: "1" },
    });

    expect(productDb).toBeDefined();
    expect(productDb).not.toBeNull();
    expect("1").toEqual(productDb?.id);
    expect("Product 1").toEqual(productDb?.name);
    expect("Product 1 description").toEqual(productDb?.description);
    expect(100).toEqual(productDb?.purchasePrice);
    expect(10).toEqual(productDb?.stock);
  });
});
