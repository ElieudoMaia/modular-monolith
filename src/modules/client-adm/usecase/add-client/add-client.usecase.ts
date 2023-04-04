import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { UseCaseInterface } from '../../../@shared/usecase/use-case.interface';
import { Client } from '../../domain/client.entity';
import { ClientGateway } from '../../gateway/client.gateway';
import { AddClientInputDTO, AddClientOutputDTO } from './add-client.usecase.dto';

export class AddClientUseCase implements UseCaseInterface {
  constructor(
    private readonly clientGateway: ClientGateway,
  ) {}

  async execute(input: AddClientInputDTO): Promise<AddClientOutputDTO> {
    const client = new Client({
      name: input.name,
      email: input.email,
      address: input.address,
    });

    await this.clientGateway.add(client);

    return {
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
    };
  }
}
