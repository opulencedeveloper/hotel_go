import { Types } from "mongoose";
import { Order } from "./entity";
import { ICreateOrderInput, IUpdateOrderStatus } from "./interface";
import { OrderStatus } from "./enum";

class OrderService {
  public async createOrder(input: ICreateOrderInput) {
    const order = new Order({ ...input });
    await order.save();

    return order;
  }

    public async findOrdersByHotelId(hotelId: Types.ObjectId) {
    const orders = await Order.find({ hotelId })
      .populate({
        path: "items.menuId", // populate menuId inside items array
        select: "itemName category ingredients", // select fields you need
      })
      .exec();

    return orders;
  }

   public async findOrderBylId(id: Types.ObjectId) {
    const orders = await Order.findById(id);

    return orders;
  }


  

   public async editOrderStatus(input: IUpdateOrderStatus,) {
      const { status, orderId } = input;
  
      // Step 1: Find existing stay
      const existingStay = await Order.findById(orderId);
  
      if (!existingStay) {
        return;
      }
  
      // ✅ Step 2: StayStatus forward-only logic
      if (status) {
        const statusOrder = [
          OrderStatus.PENDING,
          OrderStatus.CANCELLED,
          OrderStatus.READY,
          OrderStatus.PAID,
        ];
  
        const currentIndex = statusOrder.indexOf(existingStay.status);
        const newIndex = statusOrder.indexOf(status);
  
        if (newIndex < currentIndex) {
        
           return `Invalid order status update. Cannot change from '${existingStay.status}' to '${status}'.`
          
        }
      }
  
      // ✅ Step 4: Update stay
      const updatedStay = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { ...input } },
        { new: true, runValidators: true }
      ).populate({
        path: "items.menuId", // populate menuId inside items array
        select: "itemName category ingredients", // select fields you need
      })
      .exec();;
  
      return updatedStay;
    }
}

export const orderService = new OrderService();
