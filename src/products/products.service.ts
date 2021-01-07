import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { AddProductDto } from './dto/addProduct.dto';
import { updateProductDto } from './dto/updateProduct.dto';
import { concat } from 'rxjs';
const fs = require('fs')

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('product')
        private readonly ProductModel: Model<Product>,
    ) { }
    async addProduct(file, AddProductDto: AddProductDto): Promise<Product> {
        const addedProduct = await new this.ProductModel({
            productName: AddProductDto.productName,
            image: file.filename,
            discription: AddProductDto.discription,
            category: AddProductDto.category,
            price: AddProductDto.price,
            createDate: Date(),
            updateDate: Date(),
            status: true,
        });
        if (!addedProduct) {
            throw new HttpException('Product not added', 400);
        }
        return addedProduct.save();
    }

    async updateproduct(file, updateProductDto: updateProductDto): Promise<Product> {
        const record = await this.ProductModel.findOne({ _id: updateProductDto.id }).exec()
        fs.unlinkSync("./uploads/products/" + record.image)
        updateProductDto.image = file.filename
        const updateData = await this.ProductModel.updateOne({ _id: updateProductDto.id }, updateProductDto).exec()
        return updateData
    }

    // async getProducts(): Promise<Product[]> {
    //     const products = await this.ProductModel.aggregate([
    //         {
    //             $project: {
    //                 productName: 1,
    //                 discription: 1,
    //                 category: 1,
    //                 price: 1,
    //                 status: 1,
    //                 image: { $concat: ["./uploads/products", "$image"] }
    //             }
    //         }
    //     ]).exec();
    //     return products;
    // }

    async getProductById(id): Promise<Product[]> {
        const product = await this.ProductModel.find({ _id: id }).exec();
        return product;
    }

    async sortByFilter(): Promise<Product[]> {
        const product = await this.ProductModel.find().sort({ price: 1 }).exec(); // use -1 for desending
        return product;
    }

    async sortByName(search): Promise<Product[]> {
        const products = await this.ProductModel.aggregate([
            {
                $match: {
                    productName: new RegExp(search, 'i')
                }
            },
            {
                $project: {
                    productName: 1,
                    discription: 1,
                    category: 1,
                    price: 1,
                    status: 1,
                    image: { $concat: ["./uploads/products/", "$image"] }
                }
            }
        ]).exec();
        return products;
        // const product = await this.ProductModel.find({
        //     productName: new RegExp(search, 'i'), // provides all when no arguments passed
        // }).exec();
        // return product;
    }

    async countProducts(getData) {
        const counts = await this.ProductModel.find({ category: getData })
            .countDocuments()
            .exec();
        return counts;
    }

    async deleteProduct(id) {
        const record = await this.ProductModel.findOne({ _id: id }).exec()
        fs.unlinkSync("./uploads/products/" + record.image)
        const result = await this.ProductModel.deleteOne({ _id: id }).exec()
        return result
    }

}
