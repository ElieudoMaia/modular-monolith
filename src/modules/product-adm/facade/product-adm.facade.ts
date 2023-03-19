import { AddProductUseCaseInterface } from '../usecase/add-product/add-product.usecase.interface';
import { CheckStockUseCaseInterface } from '../usecase/check-stock/check-stock.usecase.interface';
import {
  AddProductFacadeInputDTO,
  CheckStockFacadeInputDTO,
  CheckStockFacadeOutputDTO,
  ProductAdmFacadeInterface,
} from "./product-adm.facade.interface";

export interface ProductAdmFacadeProps {
  addproductUsecase: AddProductUseCaseInterface
  checkStockUsecase: CheckStockUseCaseInterface;
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private readonly _addproductUsecase: AddProductUseCaseInterface;
  private readonly _checkStockUsecase: CheckStockUseCaseInterface;

  constructor(usecases: ProductAdmFacadeProps) {
    this._addproductUsecase = usecases.addproductUsecase;
    this._checkStockUsecase = usecases.checkStockUsecase;
  }

  async addProduct(input: AddProductFacadeInputDTO): Promise<void> {
    await this._addproductUsecase.execute(input);
  }

  async checkStock(
    input: CheckStockFacadeInputDTO
  ): Promise<CheckStockFacadeOutputDTO> {
    const output = await this._checkStockUsecase.execute(input);
    return {
      productId: input.productId,
      stock: output.stock,
    }
  }
}
