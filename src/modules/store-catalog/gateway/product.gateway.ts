import { Product } from '../domain/product.entity';
import { FindProductInputDTO } from '../usecase/find-product/find-product.dto';

export interface ProductGateway {
  findAll(): Promise<Product[]>;
  find(id: string): Promise<Product | null>;
}
