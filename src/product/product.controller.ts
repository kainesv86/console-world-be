import { Controller, UseInterceptors, Post, UseGuards, UploadedFile, HttpException, Body, UsePipes } from '@nestjs/common';
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

@ApiTags('product')
@Controller('product')
@ApiBearerAuth()
export class ProductController {
    constructor(private readonly productService: ProductService, private readonly firebaseService: FirebaseService, private readonly productCategoryService: ProductCategoryService) {}

    @Post()
    @UseGuards()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Create product' })
    async cCreateProduct(@Body(new JoiValidatorPipe(vAddProductDTO)) body: AddProductDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException(ResponseMessage.INVALID_IMAGE, StatusCodes.BAD_REQUEST);
        }

        if (!body.categories) {
            throw new HttpException(ResponseMessage.INVALID_CATEGORIES, StatusCodes.BAD_REQUEST);
        }

        const idsArray = body.categories.toString().split(',');

        const categories = await this.productCategoryService.findMany(idsArray);

        if (idsArray.length !== categories.length) {
            throw new HttpException(ResponseMessage.INVALID_CATEGORY, StatusCodes.BAD_REQUEST);
        }

        const imageName = await this.firebaseService.addFile(file);
        const imageUrl = await this.firebaseService.getFileUrl(imageName);

        const product = new Product();
        product.imageUrl = imageUrl;

        product.name = body.name;
        product.price = body.price;
        product.description = body.description;
        product.details = body.details;
        product.categories = categories;
        product.isSale = body.isSale;
        product.quantity = body.quantity;

        const date = new Date().toISOString();
        product.createAt = date;
        product.updateAt = date;

        return await this.productService.createOne(product);
    }
}
