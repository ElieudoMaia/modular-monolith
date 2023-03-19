import { ProductGateway } from '../../gateway/product.gateway';
import { CheckStockInputDTO, CheckStockOutputDTO } from './check-stock.usecase.dto';
import { CheckStockUseCaseInterface } from './check-stock.usecase.interface';

export class CheckStockUseCase implements CheckStockUseCaseInterface {
  constructor(private productRepository: ProductGateway) {}

  async execute(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
    const product = await this.productRepository.find(input.productId);

    return {
      stock: product.stock,
    };
  }
}
