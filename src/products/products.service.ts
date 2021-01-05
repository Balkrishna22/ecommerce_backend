import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { AddProductDto } from './dto/addProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product')
    private readonly ProductModel: Model<Product>,
  ) {}
  async addProduct(file, AddProductDto: AddProductDto): Promise<Product> {
    const addedProduct = await new this.ProductModel({
      productName: AddProductDto.productName,
      image: file.filename,
      discription: AddProductDto.discription,
      category: AddProductDto.category,
      price: AddProductDto.price,
      createDate: Date(),
      updateDate: Date(),
    });
    if (!addedProduct) {
      throw new HttpException('Product not added', 404);
    }
    return addedProduct.save();
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.ProductModel.find().exec();
    return products;
  }

  async getProductById(id): Promise<Product[]> {
    const product = await this.ProductModel.find({ _id: id }).exec();
    return product;
  }

  async sortByFilter(): Promise<Product[]> {
    const product = await this.ProductModel.find().sort({ price: 1 }).exec(); // use -1 for desending
    return product;
  }

  async sortByName(search): Promise<Product[]> {
    const product = await this.ProductModel.find({
      productName: new RegExp(search, 'i'),
    }).exec();
    return product;
  }

  async countProducts(getData) {
    const counts = await this.ProductModel.find({ category: getData })
      .countDocuments()
      .exec();
    return counts;
  }
}
