import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './schema/admin.schema';
import { userSchema } from '../user/schema/user.schema';
import { productSchema } from '../products/schema/product.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'admin', schema: adminSchema }, { name: 'user', schema: userSchema }, { name: 'product', schema: productSchema }])],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule { }
