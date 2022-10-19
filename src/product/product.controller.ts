import { Controller, UseInterceptors, Post, UseGuards, UploadedFile, HttpException, Body, UsePipes, Put, Param, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from 'src/core/interface';
import { Product } from 'src/core/models/product';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { AddProductDTO, vAddProductDTO } from './dto/addProduct.dto';
import { ProductCategoryService } from 'src/product-category/product-category.service';
import { UpdateProductDTO, vUpdateProductDTO } from './dto/updateProduct.dto';
import { template } from 'lodash';
import { serialize } from 'src/core/interceptors/serialization.interception';

@ApiTags('product')
@Controller(ProductController.endPoint)
@ApiBearerAuth()
export class ProductController {
    static endPoint = 'product';
    constructor(private readonly productService: ProductService, private readonly firebaseService: FirebaseService, private readonly productCategoryService: ProductCategoryService) {}

    @Post()
    @UseGuards()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Create product' })
    @serialize(Product)
    async cCreateProduct(@Body(new JoiValidatorPipe(vAddProductDTO)) body: AddProductDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException(ResponseMessage.INVALID_IMAGE, StatusCodes.BAD_REQUEST);
        }

        if (!body.categories) {
            throw new HttpException(ResponseMessage.INVALID_CATEGORIES, StatusCodes.BAD_REQUEST);
        }

        const existCategoryIds = body.categories.filter((item) => item.id !== '').map((item) => item.id);

        const existCategories = await this.productCategoryService.findMany(existCategoryIds);

        if (existCategoryIds.length !== existCategories.length) {
            throw new HttpException(ResponseMessage.INVALID_CATEGORY, StatusCodes.BAD_REQUEST);
        }

        // Filter categories which non id
        const categoryNameNonIds = body.categories.filter((item) => item.id === '').map((item) => item.name);

        // Duplicate category name
        const categoryNameIds = await this.productCategoryService.findManyByNames(categoryNameNonIds);

        // New category name
        const newCategoryNames = categoryNameNonIds.filter((item) => !categoryNameIds.map((item) => item.name).includes(item));

        const newCategories = await this.productCategoryService.createMany(newCategoryNames);

        const imageName = await this.firebaseService.addFile(file);
        const imageUrl = await this.firebaseService.getFileUrl(imageName);

        const product = new Product();
        product.imageUrl = imageUrl;

        product.name = body.name;
        product.price = body.price;
        product.description = body.description;
        product.details = body.details;
        product.categories = [...existCategories, ...newCategories, ...categoryNameIds];
        product.isSale = body.isSale;
        product.quantity = body.quantity;

        const date = new Date().toISOString();
        product.createAt = date;
        product.updateAt = date;

        return await this.productService.saveOne(product);
    }

    @Get('/:id')
    @UseGuards()
    @ApiOperation({ summary: 'Get product by id' })
    @serialize(Product)
    async cGetProduct(@Param('id') id: string) {
        const product = await this.productService.getOneByField('id', id);

        if (!product) {
            throw new HttpException(ResponseMessage.INVALID_PRODUCT, StatusCodes.NOT_FOUND);
        }

        return product;
    }

    @Put('/:id')
    @UseGuards()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Update product' })
    async cUpdateProduct(@Param('id') id: string, @Body(new JoiValidatorPipe(vUpdateProductDTO)) body: UpdateProductDTO, @UploadedFile() file: Express.Multer.File) {
        const product = await this.productService.getOneByField('id', id);

        if (!product) {
            throw new HttpException(ResponseMessage.INVALID_PRODUCT, StatusCodes.NOT_FOUND);
        }

        if (body.categories) {
            const idsArray = body.categories.toString().split(',');

            const categories = await this.productCategoryService.findMany(idsArray);

            if (idsArray.length !== categories.length) {
                throw new HttpException(ResponseMessage.INVALID_CATEGORY, StatusCodes.BAD_REQUEST);
            }
        }

        if (file) {
            const imageName = await this.firebaseService.addFile(file);
            const imageUrl = await this.firebaseService.getFileUrl(imageName);
            product.imageUrl = imageUrl;
        }

        product.name = body.name || product.name;
        product.price = body.price || product.price;
        product.description = body.description || product.description;
        product.details = body.details || product.details;
        product.isSale = body.isSale || product.isSale;
        product.quantity = body.quantity || product.quantity;

        this.productService.saveOne(product);

        return product;
    }
}
