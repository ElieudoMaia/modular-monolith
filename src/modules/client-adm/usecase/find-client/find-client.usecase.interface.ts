import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  FindClientInputDTO,
  FindClientOutputDTO,
} from "./find-client.usecase.dto";

export interface FindClientAdmUseCaseInterface
  extends UseCaseInterface<FindClientInputDTO, FindClientOutputDTO> {}
