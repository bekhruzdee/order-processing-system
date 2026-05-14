import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  createOrder(data: any) {
    return this.prisma.order.create({
      data,
    });
  }

  getOrders() {
    return this.prisma.order.findMany();
  }
}