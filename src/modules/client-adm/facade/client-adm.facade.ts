import { AddClientAdmUseCaseInterface } from '../usecase/add-client/add-client.usecase.interface';
import { FindClientAdmUseCaseInterface } from '../usecase/find-client/find-client.usecase.interface';
import { AddClientFacadeInputDTO, ClientFacadeInterface, FindClientFacadeInputDTO, FindClientFacadeOutputDTO } from './client-adm.facade.interface';

export interface ClientAdmFacadeProps {
  addClientUsecase: AddClientAdmUseCaseInterface
  findClientUsecase: FindClientAdmUseCaseInterface;
}

export class ClientAdmFacade implements ClientFacadeInterface {
  private readonly _addClientUsecase: AddClientAdmUseCaseInterface;
  private readonly _findClientUsecase: FindClientAdmUseCaseInterface;

  constructor(usecases: ClientAdmFacadeProps) {
    this._addClientUsecase = usecases.addClientUsecase;
    this._findClientUsecase = usecases.findClientUsecase;
  }

  async addClient(input: AddClientFacadeInputDTO): Promise<void> {
    await this._addClientUsecase.execute(input);
  }
  findClient(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO> {
    return this._findClientUsecase.execute(input);
  }
}
