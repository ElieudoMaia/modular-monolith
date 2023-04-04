import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { Client } from '../../domain/client.entity';
import { FindClientUseCase } from './find-client.usecase';

const client = new Client({
  id: new Id('1'),
  name: 'Any name',
  email: 'any@mail.com',
  address: 'Any address',
});

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockResolvedValue(client),
});

describe('FindClient usecase', () => {
  test('should find a client', async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);
    const input = { id: '1' };
    const output = await usecase.execute(input);
    expect(repository.find).toHaveBeenCalledWith(input.id);
    expect(output).toEqual({
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  })
})
