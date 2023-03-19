import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  CheckStockInputDTO,
  CheckStockOutputDTO,
} from "./check-stock.usecase.dto";

export interface CheckStockUseCaseInterface
  extends UseCaseInterface<CheckStockInputDTO, CheckStockOutputDTO> {}
