import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  PlaceOrderUseCaseInputDTO,
  PlaceOrderUseCaseOutputDTO,
} from "./place-order.usecase.dto";

export interface PlaceOrderUseCaseInterface
  extends UseCaseInterface<
    PlaceOrderUseCaseInputDTO,
    PlaceOrderUseCaseOutputDTO
  > {}
