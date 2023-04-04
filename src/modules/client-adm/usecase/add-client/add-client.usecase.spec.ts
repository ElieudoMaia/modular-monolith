import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { AddClientUseCase } from './add-client.usecase';

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
});

describe('AddClient usecase', () => {
  test('should add a client', async () => {
    const clientGateway = MockRepository();
    const usecase = new AddClientUseCase(clientGateway);
    const input = {
      name: 'Any name',
      email: 'any@mail.com',
      address: 'any address',
    }
    const result = await usecase.execute(input);
    expect(clientGateway.add).toBeCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  })
})
