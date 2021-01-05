import { UserService } from './user.service';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { AddUserDto } from './dto/user.dto';
import { loginUserDto } from './dto/userlogin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUser')
  async addUsers(@Res() res, @Body() AddUserDto: AddUserDto) {
    const addedUser = await this.userService.addUser(AddUserDto);
    return res.status(HttpStatus.OK).json({ data: addedUser });
  }

  @Post('login')
  async login(@Res() res, @Body() loginUserDto: loginUserDto) {
    const addUser = await this.userService.loginUser(loginUserDto);
    return res.status(HttpStatus.OK).json({ key: addUser });
  }

  @Get('all')
  async getAllUsers(@Res() res) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json({ data: users });
  }
}
