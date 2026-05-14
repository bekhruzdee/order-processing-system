import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order-service.service';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: any) {
    return this.orderService.createOrder(body);
  }

  @Get()
  findAll() {
    return this.orderService.getOrders();
  }
}