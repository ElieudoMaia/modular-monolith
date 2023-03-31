import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { ProductGateway } from '../../gateway/product.gateway';
import { FindProductInputDTO, FindProductOutputDTO } from "./find-product.dto";

export class FindProductUseCase implements UseCaseInterface<FindProductInputDTO, FindProductOutputDTO> {
  constructor(
    private readonly productRepository: ProductGateway,
  ) {}

  async execute(input: FindProductInputDTO): Promise<FindProductOutputDTO> {
    const product = await this.productRepository.find(input.id);
    if (!product) throw new Error("Product not found");
    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
