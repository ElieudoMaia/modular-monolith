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
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ allowNull: false })
  declare zipCode: string;

  @Column({ allowNull: false })
  declare complement: string;
}
