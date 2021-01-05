import { Injectable, HttpException } from '@nestjs/common';
import { AddAdminDto } from './dto/addAdmin.dto';
import { loginAdminDto } from './dto/adminLogin.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './interfaces/admin.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('admin')
    private readonly AdminModel: Model<Admin>,
  ) {}

  async addAdmin(AddAdminDto: AddAdminDto): Promise<Admin> {
    AddAdminDto.password = await bcrypt.hash(AddAdminDto.password, 10);
    const addedAdmin = await new this.AdminModel({
      name: AddAdminDto.name,
      email: AddAdminDto.email,
      password: AddAdminDto.password,
      status: true,
      createDate: Date(),
      updateDate: Date(),
    });
    if (!addedAdmin) {
      throw new HttpException('admin not added', 404);
    }
    return addedAdmin.save();
  }

  async loginAdmin(loginAdminDto: loginAdminDto): Promise<Admin> {
    const loginAdmin = await this.AdminModel.findOne({
      email: loginAdminDto.email,
    }).exec();
    if (!loginAdmin) {
      throw new HttpException('Admin not found', 404);
    }
    const isMatch = await bcrypt.compare(
      loginAdminDto.password,
      loginAdmin.password,
    );
    if (isMatch) {
      return loginAdmin;
    }
    throw new HttpException('Incorrect password', 404);
  }
}
