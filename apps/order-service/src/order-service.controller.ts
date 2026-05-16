import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order-service.service';

@Controller()
export class OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  create(body: any) {
    return this.orderService.createOrder(body);
  }

  @MessagePattern('get_orders')
  findAll() {
    return this.orderService.getOrders();
  }

  @MessagePattern('get_order')
  findOne(data: any) {
    return this.orderService.getOrderById(data.id);
  }
}
