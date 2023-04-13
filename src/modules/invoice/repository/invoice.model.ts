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
  id!: string;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  document!: string;

  @Column({ allowNull: false })
  createdAt!: Date;

  @Column({ allowNull: false })
  updatedAt!: Date;

  @HasMany(() => ProductModel, { foreignKey: "invoiceId", as: "products" })
  products!: ProductModel[];

  @HasOne(() => AddressModel, { foreignKey: "invoiceId", as: "address" })
  address!: AddressModel;
}
