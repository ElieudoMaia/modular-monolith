import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  ProcessPaymentInputDTO,
  ProcessPaymentOutputDTO,
} from "./process-payment.usecase.dto";

export interface ProcessPaymentUseCaseInterface
  extends UseCaseInterface<ProcessPaymentInputDTO, ProcessPaymentOutputDTO> {}
