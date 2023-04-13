import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  GenerateInvoiceUseCaseInputDTO,
  GenerateInvoiceUseCaseOutputDTO,
} from "./generate-invoice.usecase.dto";

export interface GenerateInvoiceUseCaseInterface
  extends UseCaseInterface<
    GenerateInvoiceUseCaseInputDTO,
    GenerateInvoiceUseCaseOutputDTO
  > {}
