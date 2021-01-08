import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Post,
    Body,
    Param,
    Put,
    Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/addAdmin.dto';
import { loginAdminDto } from './dto/adminLogin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('addAdmin')
    async addAdmin(@Res() res, @Body() AddAdminDto: AddAdminDto) {
        const addedUser = await this.adminService.addAdmin(AddAdminDto);
        return res.status(HttpStatus.OK).json({ status: true, data: addedUser });
    }

    @Post('login')
    async login(@Res() res, @Body() loginAdminDto: loginAdminDto) {
        const loggedInAdmin = await this.adminService.loginAdmin(loginAdminDto);
        return res.status(HttpStatus.OK).json({ status: true, data: loggedInAdmin , message :'Logged in successfully '});
    }

    @Get('dashBoard')
    async dashBoard(@Res() res) {
        const data = await this.adminService.dashBoard();
        return res.status(HttpStatus.OK).json({ status: true, data: data  , message :'dashBoard data' });
    }

    @Put('upadateUserStatus')
    async upadetUserStatus(@Res() res, @Query('id') id) {
        const data = await this.adminService.updateUserStatus(id);
        return res.status(HttpStatus.OK).json({ status: true, data: data , message :'status updated'});
    }

    @Put('upadateProductStatus')
    async upadetProductStatus(@Res() res, @Query('id') id) {
        const data = await this.adminService.upadetProductStatus(id);
        return res.status(HttpStatus.OK).json({ status: true, data: data , message :'status updated'});
    }
}
