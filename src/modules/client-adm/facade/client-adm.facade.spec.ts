import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import { ClientAdmFacadeFactory } from '../factory/facade.factory';

describe("ClientAdm facade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  test("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "John Doe",
      email: "mail@mail.com",
      address: "Any address",
    };

    await facade.addClient(input);

    const client = await ClientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client?.id).toBe(input.id);
    expect(client?.name).toBe(input.name);
    expect(client?.email).toBe(input.email);
    expect(client?.address).toBe(input.address);
  });

  test("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "John Doe",
      email: "any@mail.com",
      address: "Any address",
    };

    await ClientModel.create(input);

    const client = await facade.findClient({ id: input.id });

    expect(client).toBeDefined();
    expect(client?.id).toBe(input.id);
    expect(client?.name).toBe(input.name);
    expect(client?.email).toBe(input.email);
    expect(client?.address).toBe(input.address);
  });
});
