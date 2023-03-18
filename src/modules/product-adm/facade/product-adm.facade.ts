import { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import { AddProductUseCaseInterface } from '../usecase/add-product.usecase.interface';
import {
  AddProductFacadeInputDTO,
  CheckStockFacadeInputDTO,
  CheckStockFacadeOutputDTO,
  ProductAdmFacadeInterface,
} from "./product-adm.facade.interface";

export interface ProductAdmFacadeProps {
  addproductUsecase: AddProductUseCaseInterface
  checkStockUsecase: UseCaseInterface;
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private readonly _addproductUsecase: AddProductUseCaseInterface;
  private readonly _checkStockUsecase: UseCaseInterface;

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
    return this._checkStockUsecase.execute(input);
  }
}
