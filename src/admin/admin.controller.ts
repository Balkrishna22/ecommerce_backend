import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/addAdmin.dto';
import { loginAdminDto } from './dto/adminLogin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('addAdmin')
  async addAdmin(@Res() res, @Body() AddAdminDto: AddAdminDto) {
    const addedUser = await this.adminService.addAdmin(AddAdminDto);
    return res.status(HttpStatus.OK).json({ data: addedUser });
  }

  @Post('login')
  async login(@Res() res, @Body() loginAdminDto: loginAdminDto) {
    const loggedInAdmin = await this.adminService.loginAdmin(loginAdminDto);
    return res.status(HttpStatus.OK).json({ key: loggedInAdmin });
  }
}
