import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://aishwary:DqmkKAaQXHcMfUXz@cluster0.gvn9t.mongodb.net/e-commerce>?retryWrites=true&w=majority',
    ),
    ProductsModule,
    AdminModule,
  ],
})
export class AppModule {}
