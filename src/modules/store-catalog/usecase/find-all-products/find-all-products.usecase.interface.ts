import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { FindAllProductsOutputDTO } from "./find-all-products.dto";

export interface FindAllProductsUseCaseInterface
  extends UseCaseInterface<never, FindAllProductsOutputDTO> {}
