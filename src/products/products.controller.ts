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
    Delete
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto } from './dto/addProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('addProduct')
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
    async addProduct(
        @UploadedFile() image,
        @Res() res,
        @Body() AddProductDto: AddProductDto,
    ) {
        const addedUser = await this.productsService.addProduct(
            image,
            AddProductDto,
        );
        return res.status(HttpStatus.OK).json({ data: addedUser });
    }

    @Get('productDetail/:id')
    async getProductById(@Res() res, @Param('id') id) {
        const data = await this.productsService.getProductById(id);
        return res.status(HttpStatus.OK).json({ key: data });
    }

    @Get('priceFilter')
    async sortByFilter(@Res() res) {
        const data = await this.productsService.sortByFilter();
        return res.status(HttpStatus.OK).json({ key: data });
    }

    @Get('all')
    async sortByName(@Res() res, @Query('search') search) {
        const data = await this.productsService.sortByName(search);
        return res.status(HttpStatus.OK).json({ key: data });
    }

    @Get('productCount')
    async productcount(@Res() res, @Query('category') category) {
        const data = await this.productsService.countProducts(category);
        return res.status(HttpStatus.OK).json({ key: data });
    }

    @Delete('deleteProduct')
    async deleteProduct(@Res() res, @Query('id') id) {
        const data = await this.productsService.deleteProduct(id);
        return res.status(HttpStatus.OK).json({ key: data });
        
    }
}
