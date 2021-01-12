import { Injectable, HttpException } from '@nestjs/common';
import { AddUserDto } from './dto/user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/userlogin.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectModel('user')
        private readonly UserModel: Model<User>,
    ) { }

    async addUser(AddUserDto: AddUserDto): Promise<User> {
        const existUser = await this.UserModel.findOne({ email: AddUserDto.email }).exec()
        if (!existUser) {
            AddUserDto.password = await bcrypt.hash(AddUserDto.password, 10);
            const addedUser = await new this.UserModel({
                name: AddUserDto.name,
                email: AddUserDto.email,
                password: AddUserDto.password,
                status: "ACTIVE", // ACTIVE, INACTIVE
                createDate: Date(),
                updateDate: Date(),
            });
            if (!addedUser) {
                throw new HttpException('user not added', 404);
            }
            return addedUser.save();
        } else {
            throw new HttpException('Email already exist', 404);
        }
    }

    async loginUser(loginUserDto: loginUserDto): Promise<User> {
        const loginUser = await this.UserModel
            .findOne({ email: loginUserDto.email })
            .exec();
        if (!loginUser) {
            throw new HttpException('User not found', 404);
        }
        const isMatch = await bcrypt.compare(
            loginUserDto.password,
            loginUser.password,
        );
        if (isMatch) {
            return loginUser;
        }
        throw new HttpException('Incorrect password', 404);
    }

    async getUsers(): Promise<User[]> {
        const users = await this.UserModel.find().exec();
        return users;
    }
}
