import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from './generated/prisma';
import { PrismaService } from './prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { name: string; email: string }) {
    const { name, email } = data;

    if (!name) {
      throw new RpcException({
        status: 'error',
        message: 'name is required',
      });
    }

    if (!email) {
      throw new RpcException({
        status: 'error',
        message: 'email is required',
      });
    }

    try {
      const user = await this.prisma.user.create({
        data: { name, email },
      });

      return {
        status: 'success',
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            status: 'error',
            message: 'Email already exists',
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

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
