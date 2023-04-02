import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { FindProductInputDTO } from "./find-product.dto";
import { FindProductOutputDTO } from "./find-product.dto";

export interface FindProductUseCaseInterface
  extends UseCaseInterface<FindProductInputDTO, FindProductOutputDTO> {}
