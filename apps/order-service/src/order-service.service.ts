import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: { userId: number; total: number; status?: string }) {
    const { userId, total, status } = data;

    if (!userId) throw new BadRequestException('userId is required');
    if (!total) throw new BadRequestException('total is required');

    return this.prisma.order.create({
      data: {
        userId,
        total,
        status: status ?? 'PENDING',
      },
    });
  }

  async getOrders() {
    return this.prisma.order.findMany();
  }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }
}