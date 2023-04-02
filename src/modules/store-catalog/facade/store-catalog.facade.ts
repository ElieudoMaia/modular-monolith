import { FindAllProductsUseCaseInterface } from "../usecase/find-all-products/find-all-products.usecase.interface";
import { FindProductUseCaseInterface } from "../usecase/find-product/find-product.usecase.interface";
import {
  FindAllStoreCatalogFacadeOutputDTO,
  FindStoreCatalogFacadeInputDTO,
  FindStoreCatalogFacadeOutputDTO,
  StoreCatalogFacadeInterface,
} from "./store-catalog.facade.interface";

export interface StoreCatalogFacadeProps {
  findProductUseCase: FindProductUseCaseInterface;
  findAllProductsUseCase: FindAllProductsUseCaseInterface;
}

export class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private readonly _findProductUseCase: FindProductUseCaseInterface;
  private readonly _findAllProductsUseCase: FindAllProductsUseCaseInterface;

  constructor(usecases: StoreCatalogFacadeProps) {
    this._findProductUseCase = usecases.findProductUseCase;
    this._findAllProductsUseCase = usecases.findAllProductsUseCase;
  }

  async findProduct(
    input: FindStoreCatalogFacadeInputDTO
  ): Promise<FindStoreCatalogFacadeOutputDTO> {
    const { id } = input;
    return this._findProductUseCase.execute({ id });
  }
  async findAllProducts(): Promise<FindAllStoreCatalogFacadeOutputDTO> {
    const { products } = await this._findAllProductsUseCase.execute();
    return { products };
  }
}
