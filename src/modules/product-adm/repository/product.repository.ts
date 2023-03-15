import { Product } from '../domain/product.entity';
import { ProductGateway } from '../gateway/product.gateway';
import { ProductModel } from './product.model';

export class ProductRepository implements ProductGateway {
  find(id: string): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
