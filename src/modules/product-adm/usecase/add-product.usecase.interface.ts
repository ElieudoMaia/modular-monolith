import { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import { AddProductInputDTO, AddProductOutputDTO } from "./add-product.dto";

export interface AddProductUseCaseInterface
  extends UseCaseInterface<AddProductInputDTO, AddProductOutputDTO> {}
