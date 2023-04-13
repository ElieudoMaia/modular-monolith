import { FindInvoiceUseCaseInterface } from "../usecase/find-invoice/find-invoice.usecase.interface.dto";
import { GenerateInvoiceUseCaseInterface } from "../usecase/generate-invoice/generate-invoice.usecase.interface";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDTO,
  GenerateInvoiceFacadeOutputDTO,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

export type InvoiceFacadeProps = {
  findInvoiceUseCase: FindInvoiceUseCaseInterface;
  generateInvoiceUseCase: GenerateInvoiceUseCaseInterface;
};

export class InvoiceFacade implements InvoiceFacadeInterface {
  private _findInvoiceUseCase: FindInvoiceUseCaseInterface;
  private _generateInvoiceUseCase: GenerateInvoiceUseCaseInterface;

  constructor(props: InvoiceFacadeProps) {
    this._findInvoiceUseCase = props.findInvoiceUseCase;
    this._generateInvoiceUseCase = props.generateInvoiceUseCase;
  }

  findInvoice(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findInvoiceUseCase.execute(input);
  }
  generateInvoice(
    input: GenerateInvoiceFacadeInputDTO
  ): Promise<GenerateInvoiceFacadeOutputDTO> {
    return this._generateInvoiceUseCase.execute(input);
  }
}
