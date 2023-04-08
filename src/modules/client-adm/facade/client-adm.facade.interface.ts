export interface AddClientFacadeInputDTO {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface FindClientFacadeInputDTO {
  id: string;
}

export interface FindClientFacadeOutputDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFacadeInterface {
  addClient(input: AddClientFacadeInputDTO): Promise<void>;
  findClient(
    input: FindClientFacadeInputDTO
  ): Promise<FindClientFacadeOutputDTO>;
}
