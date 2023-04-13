import { Model, Table, Column, PrimaryKey, BelongsTo } from "sequelize-typescript";
import { InvoiceModel } from './invoice.model';
// import { InvoiceModel } from './invoice.model';

@Table({
  tableName: "addresses",
  timestamps: false,
})
export class AddressModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  invoiceId!: string;

  @Column({ allowNull: false })
  street!: string;

  @Column({ allowNull: false })
  number!: string;

  @Column({ allowNull: false })
  city!: string;

  @Column({ allowNull: false })
  state!: string;

  @Column({ allowNull: false })
  zipCode!: string;

  @Column({ allowNull: false })
  complement!: string;
}
