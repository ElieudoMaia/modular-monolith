import { Product } from '../domain/product.entity';

export interface ProductGateway {
  add(product: Product): Promise<Product>;
  find(id: string): Promise<Product>;
}
