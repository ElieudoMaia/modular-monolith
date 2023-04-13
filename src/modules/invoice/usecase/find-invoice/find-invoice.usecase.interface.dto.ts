import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto";

export interface FindInvoiceUseCaseInterface
  extends UseCaseInterface<
    FindInvoiceUseCaseInputDTO,
    FindInvoiceUseCaseOutputDTO
  > {}
