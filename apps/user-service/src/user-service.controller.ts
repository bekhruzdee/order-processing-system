import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user-service.service';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.createUser(body);
  }

  @Get()
  findAll() {
    return this.userService.getUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }
}