import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { AddProductDto } from './dto/addProduct.dto';
import { updateProductDto } from './dto/updateProduct.dto';
import { QueryOptions } from '../configs/query-options.config';
const fs = require('fs')

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('product')
        private readonly ProductModel: Model<Product>,
    ) { }
    async addProduct(file, AddProductDto: AddProductDto): Promise<Product> {
        const addedProduct = new this.ProductModel({
            productName: AddProductDto.productName,
            image: file.filename,
            discription: AddProductDto.discription,
            category: AddProductDto.category,
            price: AddProductDto.price,
            createDate: Date(),
            updateDate: Date(),
            status: "ACTIVE", // ACTIVE, INACTIVE
        });
        if (!addedProduct) {
            throw new HttpException('Product not added', 400);
        }
        return addedProduct.save();
    }

    async updateproduct(file, updateProductDto: updateProductDto): Promise<Product> {
        const record = await this.ProductModel.findOne({ _id: updateProductDto.id }).exec()
        if (fs.existsSync("./uploads/products/" + record.image)) {
            fs.unlinkSync("./uploads/products/" + record.image)
        }
        updateProductDto.image = file.filename
        const updateData = await this.ProductModel.updateOne({ _id: updateProductDto.id }, updateProductDto).exec()
        return updateData
    }


    async updateProductWithoutImage(updateProductDto: updateProductDto): Promise<Product> {
        // updateProductDto.image = file.filename
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
        var products = await this.ProductModel.find({ _id: id }).exec();
        products[0].image = "http://13.233.99.68:8000/uploads/products/" + products[0].image
        return products;
    }



    async sortByName(getData): Promise<any> {
        // var pagination = { skip: 0, limit: 10, totalRecord: 0 };
        // if (search.limit) {
        //     pagination.limit = Number(search.limit);
        //     if (search.page) {
        //         var skip = parseInt(search.limit) * (search.page - 1);
        //         pagination.skip = Number(skip);
        //     }
        // }

        if (!getData.sort) {
            const products = await this.ProductModel.aggregate([
                {
                    $match: {
                        productName: new RegExp(getData.search, 'i')
                    }
                }
                ,
                {
                    $project: {
                        productName: 1,
                        discription: 1,
                        category: 1,
                        price: 1,
                        status: 1,
                        image: { $concat: ["http://13.233.99.68:8000/uploads/products/", "$image"] }
                    }
                },
                // { $limit: Number(pagination.limit) },
                // { $skip: Number(pagination.skip) }
            ]
            ).exec()
            //   var productsCount = await this.ProductModel.countDocuments().exec();
            return { products };
        }
        else {
            if (getData.sort == 'des') {
                const products = await this.ProductModel.aggregate([
                    {
                        $match: {
                            productName: new RegExp(getData.search, 'i')
                        }
                    }, {
                        $sort: {
                            price: -1
                        }
                    }
                    ,
                    {
                        $project: {
                            productName: 1,
                            discription: 1,
                            category: 1,
                            price: 1,
                            status: 1,
                            image: { $concat: ["http://13.233.99.68:8000/uploads/products/", "$image"] }
                        }
                    },
                    // { $limit: Number(pagination.limit) },
                    // { $skip: Number(pagination.skip) }
                ]
                ).exec()
                //   var productsCount = await this.ProductModel.countDocuments().exec();
                return { products };
            } else {
                const products = await this.ProductModel.aggregate([
                    {
                        $match: {
                            productName: new RegExp(getData.search, 'i')
                        }
                    }, {
                        $sort: {
                            price: 1
                        }
                    }
                    ,
                    {
                        $project: {
                            productName: 1,
                            discription: 1,
                            category: 1,
                            price: 1,
                            status: 1,
                            image: { $concat: ["http://13.233.99.68:8000/uploads/products/", "$image"] }
                        }
                    },
                    // { $limit: Number(pagination.limit) },
                    // { $skip: Number(pagination.skip) }
                ]
                ).exec()
                //   var productsCount = await this.ProductModel.countDocuments().exec();
                return { products };
            }
        }



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
