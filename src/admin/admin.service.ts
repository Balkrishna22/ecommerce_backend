import { Injectable, HttpException } from '@nestjs/common';
import { AddAdminDto } from './dto/addAdmin.dto';
import { loginAdminDto } from './dto/adminLogin.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './interfaces/admin.interface';
import { User } from '../user/interfaces/user.interface';
import { Product } from '../products/interfaces/product.interface';
var randomstring = require("randomstring");

import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('admin')
        private readonly AdminModel: Model<Admin>,
        @InjectModel('user')
        private readonly userModel: Model<User>,
        @InjectModel('product')
        private readonly productModel: Model<Product>,
    ) { }

    async addAdmin(AddAdminDto: AddAdminDto): Promise<Admin> {
        const existAdmin = await this.AdminModel.findOne({ email: AddAdminDto.email }).exec()
        if (!existAdmin) {
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
                throw new HttpException('admin not added', 400);
            }
            return addedAdmin.save();
        } else {
            throw new HttpException('email already exist ', 400);
        }

    }

    async loginAdmin(loginAdminDto: loginAdminDto): Promise<Admin> {
        const authToken = randomstring.generate({
            length: 300,
            charset: 'alphanumeric'
        });
        const loginAdmin = await this.AdminModel.findOne({
            email: loginAdminDto.email,
        }).exec();
        if (!loginAdmin) {
            throw new HttpException('Admin not found', 400);
        }
        const isMatch = await bcrypt.compare(
            loginAdminDto.password,
            loginAdmin.password,
        );
        if (isMatch) {
            this.AdminModel.updateOne({ email: loginAdminDto.email }, { authToken: authToken }).exec()
            return loginAdmin;
        }
        throw new HttpException('Incorrect password', 400);
    }

    async dashBoard() {
        const count = { users: 0, products: 0 }
        count.users = await this.userModel.find().countDocuments().exec();
        count.products = await this.productModel.find().countDocuments().exec();
        return count
    }


    async updateUserStatus(userId) {
        const users = await this.userModel.findOne({ _id: userId })
        if (users.status == 'true' || users.status == 'ACTIVE') {
            const data = await this.userModel.updateOne({ _id: userId }, { status: 'INACTIVE' }).exec()
            return data
        } else {
            const data = await this.userModel.updateOne({ _id: userId }, { status: 'ACTIVE' }).exec()
            return data
        }
    }
    async upadetProductStatus(productId) {
        const products = await this.productModel.findOne({ _id: productId })
        if (products.status == 'true' || products.status == 'ACTIVE') {
            const data = await this.productModel.updateOne({ _id: productId }, { status: 'INACTIVE' }).exec()
            return data
        } else {
            const data = await this.productModel.updateOne({ _id: productId }, { status: 'ACTIVE' }).exec()

            return data
        }
    }


}
