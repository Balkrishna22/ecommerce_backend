import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Post,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    Query,
    HttpException,
    Delete,
    UploadedFiles
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto } from './dto/addProduct.dto';
import { updateProductDto } from './dto/updateProduct.dto';
import { deleteImageDto } from './dto/deleteImage.dto';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('addProduct')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 100 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/products',
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        return cb(null, `${randomName}${extname(file.originalname)}`);
                    },
                }),
            },
        ),
    )
    async addProduct(
        @UploadedFiles() image,
        @Res() res,
        @Body() AddProductDto: AddProductDto,
    ) {
        const addedProduct = await this.productsService.addProduct(
            image,
            AddProductDto,
        );
        return res.status(HttpStatus.OK).json({ status: true, data: addedProduct, message: 'Product added successfully.' });
    }

    @Get('productDetail/:id')
    async getProductById(@Res() res, @Param('id') id) {
        const data = await this.productsService.getProductById(id);
        return res.status(HttpStatus.OK).json({ status: true, data: data, message: 'Product details' });
    }

    @Get('all')
    async sortByName(@Res() res, @Query() search) {
        const data = await this.productsService.sortByName(search);
        return res.status(HttpStatus.OK).json({ status: true, data: data, message: 'All Products list' });
    }

    @Get('productCount')
    async productcount(@Res() res, @Query('category') category) {
        const data = await this.productsService.countProducts(category);
        return res.status(HttpStatus.OK).json({ status: true, data: data });
    }

    @Delete('deleteProduct')
    async deleteProduct(@Res() res, @Query('id') id) {
        const data = await this.productsService.deleteProduct(id);
        if (!data) {
            throw new HttpException('error occured ', 401);
        }
        return res.status(HttpStatus.OK).json({ status: true, message: 'product deleted successfully', data: data });
    }

    @Post('updateProduct')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async updateproduct(@UploadedFile() image, @Res() res, @Body() updateProductDto: updateProductDto) {
        if (!image) {
            const data = await this.productsService.updateProductWithoutImage(updateProductDto);
            return res.status(HttpStatus.OK).json({ status: true, data: data });
        }
        const data = await this.productsService.updateproduct(image, updateProductDto);
        return res.status(HttpStatus.OK).json({ status: true, data: data, message: 'Product updated successfully' });
    }


    @Post('deleteImage')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 100 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/products',
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        return cb(null, `${randomName}${extname(file.originalname)}`);
                    },
                }),
            },
        ),
    )
    async deleteImage(@UploadedFile() image, @Res() res, @Body() deleteImageDto: deleteImageDto,) {
        console.log(deleteImageDto.image);
        return res.json(image)
    }

}
