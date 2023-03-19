import { ProductAdmFacade } from '../facade/product-adm.facade';
import { ProductAdmFacadeInterface } from '../facade/product-adm.facade.interface';
import { ProductRepository } from '../repository/product.repository';
import { AddProductUsecase } from '../usecase/add-product/add-product.usecase';

export class ProductAdmFacadeFactory {
  static create(): ProductAdmFacadeInterface {
    const productRepository = new ProductRepository();
    const addproductUsecase = new AddProductUsecase(productRepository);
    const productFacade = new ProductAdmFacade({
      addproductUsecase,
      checkStockUsecase: { execute: async () => {} },
    });
    return productFacade;
  }
}
