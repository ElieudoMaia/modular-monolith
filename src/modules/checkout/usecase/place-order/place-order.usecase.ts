import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { ClientFacadeInterface } from "../../../client-adm/facade/client-adm.facade.interface";
import { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import { ProductAdmFacadeInterface } from "../../../product-adm/facade/product-adm.facade.interface";
import { StoreCatalogFacadeInterface } from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Client } from "../../domain/client.entity";
import { Order } from "../../domain/order.entity";
import { Product } from "../../domain/product.entity";
import { CheckoutGateway } from "../../gateway/checkout.gateway";
import {
  PlaceOrderUseCaseInputDTO,
  PlaceOrderUseCaseOutputDTO,
} from "./place-order.usecase.dto";
import { PlaceOrderUseCaseInterface } from "./place-order.usecase.interface";

export class PlaceOrderUseCase implements PlaceOrderUseCaseInterface {
  constructor(
    private readonly _clientFacade: ClientFacadeInterface,
    private readonly _productFacade: ProductAdmFacadeInterface,
    private readonly _storeCatalogFacade: StoreCatalogFacadeInterface,
    private readonly _checkoutRepository: CheckoutGateway,
    private readonly _paymentFacade: PaymentFacadeInterface,
    private readonly _invoiceFacade: InvoiceFacadeInterface
  ) {}

  async execute(
    input: PlaceOrderUseCaseInputDTO
  ): Promise<PlaceOrderUseCaseOutputDTO> {
    const client = await this._clientFacade.findClient({ id: input.clientId });
    if (!client) throw new Error("Client not found");

    await this.validateProducts(input);

    for (const { productId } of input.products) {
      const product = await this._productFacade.checkStock({
        productId,
      });
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    const purchaseClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
    });

    const order = new Order({
      client: purchaseClient,
      products,
    });

    const payment = await this._paymentFacade.processPayment({
      orderId: order.id.value,
      amount: order.total,
    });

    let invoice = null;
    if (payment.status === "approved") {
      invoice = await this._invoiceFacade.generateInvoice({
        name: client.name,
        city: client.address,
        complement: client.address,
        document: "",
        number: "",
        state: "",
        street: client.address,
        zipCode: "",
        items: products.map((p) => ({
          id: p.id.value,
          name: p.name,
          price: p.salesPrice,
        })),
      });

      order.approve();
      await this._checkoutRepository.addOrder(order);
    }

    return {
      id: order.id.value,
      invoiceId: invoice?.id ?? null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.value,
      })),
    };
  }

  private async validateProducts(
    input: PlaceOrderUseCaseInputDTO
  ): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._storeCatalogFacade.findProduct({
      id: productId,
    });
    if (!product) throw new Error("Product not found");
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
