import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from './generated/prisma';
import { PrismaService } from './prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: { userId: number; total: number; status?: string }) {
    const { userId, total, status } = data;

    if (!userId) {
      throw new RpcException({
        status: 'error',
        message: 'userId is required',
      });
    }

    if (!total) {
      throw new RpcException({
        status: 'error',
        message: 'total is required',
      });
    }

    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          total,
          status: status ?? 'PENDING',
        },
      });

      return {
        status: 'success',
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            status: 'error',
            message: 'Order primary key sequence is out of sync',
            code: error.code,
          };
        }

        return {
          status: 'error',
          message: error.message,
          code: error.code,
        };
      }

      if (error instanceof Error) {
        return {
          status: 'error',
          message: error.message,
        };
      }

      return {
        status: 'error',
        message: 'Internal server error',
      };
    }
  }

  // Return a limited page of orders by default to avoid fetching millions of rows.
  // Callers can pass `take` and `skip` when needed (via the message payload).
  async getOrders(options?: { take?: number; skip?: number }) {
    const take = options?.take ?? 100
    const skip = options?.skip ?? 0

    return this.prisma.order.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }
}
