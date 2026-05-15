import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user-service.service';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
  create(body: any) {
    return this.userService.createUser(body);
  }

  @MessagePattern('get_users')
  findAll() {
    return this.userService.getUsers();
  }

  @MessagePattern('get_user')
  findOne(data: any) {
    return this.userService.getUserById(data.id);
  }

  @MessagePattern('delete_user')
  remove(data: any) {
    return this.userService.deleteUser(data.id);
  }
}