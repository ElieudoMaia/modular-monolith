import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import { Transaction } from '../domain/transaction.entity';
import TransactionRepository from './transaction.repository';
import { Id } from '../../@shared/domain/value-object/id.value-object';

describe("TransactionRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    transaction.approve();

    const repository = new TransactionRepository();
    const result = await repository.save(transaction);

    expect(result.id.value).toBe(transaction.id.value);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);

    const transactionModel = await TransactionModel.findByPk(transaction.id.value);
    expect(transactionModel).not.toBeNull();
    expect(transactionModel?.id).toBe(transaction.id.value);
    expect(transactionModel?.status).toBe("approved");
    expect(transactionModel?.amount).toBe(transaction.amount);
    expect(transactionModel?.orderId).toBe(transaction.orderId);
  });
});
