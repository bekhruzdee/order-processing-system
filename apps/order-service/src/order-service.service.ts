import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  createOrder(data: any) {
    if (data?.userId === undefined || data?.userId === null) {
      throw new BadRequestException('userId is required');
    }

    if (data?.total === undefined || data?.total === null || data?.total === '') {
      throw new BadRequestException('total is required');
    }

    return this.prisma.order.create({
      data,
    });
  }

  getOrders() {
    return this.prisma.order.findMany();
  }
}