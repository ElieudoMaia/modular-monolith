import { ProcessPaymentUseCaseInterface } from '../usecase/process-payment/process-payment.usecase.interface';
import PaymentFacadeInterface, { PaymentFacadeInputDTO, PaymentFacadeOutputDTO } from './facade.interface';

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUseCase: ProcessPaymentUseCaseInterface) {}

  async processPayment(input: PaymentFacadeInputDTO): Promise<PaymentFacadeOutputDTO> {
    return this.processPaymentUseCase.execute(input);
  }
}
