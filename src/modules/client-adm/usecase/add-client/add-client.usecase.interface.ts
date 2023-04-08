import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  AddClientInputDTO,
  AddClientOutputDTO,
} from "./add-client.usecase.dto";

export interface AddClientAdmUseCaseInterface
  extends UseCaseInterface<AddClientInputDTO, AddClientOutputDTO> {}
