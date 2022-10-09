import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { array } from 'joi';
import { productValidateSchema } from 'src/core/models/product';
import { ProductCategory } from 'src/core/models/product-category';
import { File } from 'winston/lib/winston/transports';

export class AddProductDTO {
    @ApiProperty({ description: 'Name', example: 'The Death' })
    name: string;

    @ApiProperty({ description: 'Price', example: 5 })
    price: number;

    @ApiProperty({ description: 'Description', example: 'The Death' })
    description: string;

    @ApiProperty({
        description: 'categories',
        type: 'object',
        example: [
            { id: '123-235-123', name: 'exist cate with id' },
            { id: '', name: 'exist cate but none id' },
            { id: '', name: 'new cate' },
        ],
    })
    categories: ProductCategory[];

    @ApiProperty({ description: 'details', example: '<div>somthing</div>' })
    details: string;

    @ApiProperty({ description: 'quantity', example: 99 })
    quantity: number;

    @ApiProperty({ description: 'is sale', example: true })
    isSale: boolean;

    @ApiProperty({ type: 'string', format: 'binary' })
    image: Express.Multer.File;
}

export const vAddProductDTO = joi.object<AddProductDTO>({
    name: productValidateSchema.name,
    price: productValidateSchema.price,
    description: productValidateSchema.description,
    categories: productValidateSchema.categories,
    details: productValidateSchema.details,
    quantity: productValidateSchema.quantity,
    isSale: productValidateSchema.isSale,
});
