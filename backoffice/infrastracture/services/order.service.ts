import { Order, OrderItem } from "../domain/order.entity";
import { MongoRepository } from "../repositories/mongo.repository";
import { OrderSchema } from "../schema/order.schema";

export class OrderService {
  private readonly orderPrefix = "PG";
  private repository = new MongoRepository<Order>("orders", OrderSchema);

  async findById(id: string): Promise<Order> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.findAll();
  }

  async create(entry: Omit<Order, "_id">): Promise<Order> {
    const _id = await this.generateOrderId();

    const items = this.calculateItems(entry.items);
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);

    return this.repository.create({
      ...entry,
      _id,
      items,
      subtotal,
      total: subtotal,
      status: "pending",
    });
  }

  async update(id: string, entry: Order): Promise<Order> {
    const items = this.calculateItems(entry.items);
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);

    entry.items = items;
    entry.subtotal = subtotal;
    entry.total = subtotal;

    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private calculateItems(items: OrderItem[]): OrderItem[] {
    return items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));
  }
  private async generateOrderId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `${this.orderPrefix}-${year}-`;

    const lastOrder = await this.repository.findOne(
      { _id: { $regex: `^${prefix}` } },
      { sort: { _id: -1 } }
    );

    if (!lastOrder) {
      return `${prefix}00001`;
    }

    const lastNumber = Number(lastOrder._id.replace(prefix, ""));

    const nextNumber = lastNumber + 1;

    return `${prefix}${String(nextNumber).padStart(5, "0")}`;
  }
}
