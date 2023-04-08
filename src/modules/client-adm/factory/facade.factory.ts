import { ClientAdmFacade } from "../facade/client-adm.facade";
import { ClientRepository } from "../repository/client.repository";
import { AddClientUseCase } from "../usecase/add-client/add-client.usecase";
import { FindClientUseCase } from "../usecase/find-client/find-client.usecase";

export class ClientAdmFacadeFactory {
  static create(): ClientAdmFacade {
    const repository = new ClientRepository();
    const addClientUsecase = new AddClientUseCase(repository);
    const findClientUsecase = new FindClientUseCase(repository);
    return new ClientAdmFacade({
      addClientUsecase,
      findClientUsecase,
    });
  }
}
