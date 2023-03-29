import { Product } from '../domain/product.entity';

export interface ProductGateway {
  findAll(): Promise<Product[]>;
}
