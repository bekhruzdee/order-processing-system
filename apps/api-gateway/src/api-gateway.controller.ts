import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  @Post('orders')
  createOrder(@Body() body: any) {
    return this.orderClient.send('create_order', body);
  }

  @Get('orders')
  getOrders() {
    return this.orderClient.send('get_orders', {});
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.orderClient.send('get_order', { id: Number(id) });
  }

  @Post('users')
  createUser(@Body() body: any) {
    return this.userClient.send('create_user', body);
  }

  @Get('users')
  getUsers() {
    return this.userClient.send('get_users', {});
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.userClient.send('get_user', { id: Number(id) });
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.userClient.send('delete_user', { id: Number(id) });
  }
}
