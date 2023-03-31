import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { Product } from '../../domain/product.entity';
import { ProductGateway } from '../../gateway/product.gateway';
import { FindProductUseCase } from './find-product.usecase';

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Product 1 description',
  salesPrice: 100,
});

const makeMockRepository = (): ProductGateway => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockResolvedValue(product),
  };
};

describe('FindProduct usecase text', () => {
  test('should find a product', async () => {
    const productRepository = makeMockRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);
    const output = await findProductUseCase.execute({ id: '1' });
    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(output.id).toEqual(product.id.value);
    expect(output.name).toEqual(product.name);
    expect(output.description).toEqual(product.description);
    expect(output.salesPrice).toEqual(product.salesPrice);
  })

  test('should throw an error if product not found', async () => {
    const productRepository = makeMockRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);
    jest.spyOn(productRepository, 'find').mockResolvedValue(null);
    await expect(findProductUseCase.execute({ id: 'any' })).rejects.toThrowError('Product not found');
  })
})
