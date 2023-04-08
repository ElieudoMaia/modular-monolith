import { Transaction } from "../../domain/transaction.entity";
import PaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDTO,
  ProcessPaymentOutputDTO,
} from "./process-payment.usecase.dto";
import { ProcessPaymentUseCaseInterface } from "./process-payment.usecase.interface";

export default class ProcessPaymentUseCase
  implements ProcessPaymentUseCaseInterface
{
  constructor(private transactionRepository: PaymentGateway) {}

  async execute(
    input: ProcessPaymentInputDTO
  ): Promise<ProcessPaymentOutputDTO> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });

    transaction.process();

    const persistTransaction = await this.transactionRepository.save(
      transaction
    );

    return {
      transactionId: persistTransaction.id.value,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
