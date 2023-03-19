import { ProductAdmFacade } from "../facade/product-adm.facade";
import { ProductAdmFacadeInterface } from "../facade/product-adm.facade.interface";
import { ProductRepository } from "../repository/product.repository";
import { AddProductUsecase } from "../usecase/add-product/add-product.usecase";
import { CheckStockUseCase } from "../usecase/check-stock/check-stock.usecase";

export class ProductAdmFacadeFactory {
  static create(): ProductAdmFacadeInterface {
    const productRepository = new ProductRepository();
    const addproductUsecase = new AddProductUsecase(productRepository);
    const checkStockUsecase = new CheckStockUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
      addproductUsecase,
      checkStockUsecase,
    });
    return productFacade;
  }
}
