import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { Product } from '../../domain/product.entity';
import { ProductGateway } from '../../gateway/product.gateway';
import { AddProductInputDTO, AddProductOutputDTO } from './add-product.dto';
import { AddProductUseCaseInterface } from './add-product.usecase.interface';

export class AddProductUsecase implements AddProductUseCaseInterface{
  constructor(private productRepository: ProductGateway) {}

  async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
    const product = new Product({
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })

    await this.productRepository.add(product);

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
