import { UseCaseInterface } from '../../../@shared/usecase/use-case.interface';
import { ClientGateway } from '../../gateway/client.gateway';
import { FindClientInputDTO, FindClientOutputDTO } from './find-client.usecase.dto';

export class FindClientUseCase implements UseCaseInterface {
  constructor(
    private readonly clientGateway: ClientGateway,
  ) {}

  async execute(input: FindClientInputDTO): Promise<FindClientOutputDTO> {
    const client = await this.clientGateway.find(input.id);
    return {
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
