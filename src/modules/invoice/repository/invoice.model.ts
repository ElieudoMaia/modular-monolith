import {
  Model,
  Table,
  Column,
  PrimaryKey,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { AddressModel } from './address.model';
import { ProductModel } from './product.model';

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

  @HasMany(() => ProductModel, { foreignKey: "invoiceId", as: "products" })
  declare products: ProductModel[];

  @HasOne(() => AddressModel, { foreignKey: "invoiceId", as: "address" })
  declare address: AddressModel;
}
