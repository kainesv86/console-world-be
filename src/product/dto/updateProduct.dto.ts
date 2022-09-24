import { ApiProperty } from '@nestjs/swagger';
import { productValidateSchema } from 'src/core/models/product';
import * as joi from 'joi';

export class UpdateProductDTO {
    @ApiProperty({ description: 'Name', required: false, example: 'The Death 2' })
    name: string;

    @ApiProperty({ description: 'Description', required: false, example: 'The Death 2' })
    description: string;

    @ApiProperty({ description: 'Details', required: false, example: '<div>Details 2</div>' })
    details: string;

    @ApiProperty({ description: 'Price', required: false, example: '9' })
    price: number;

    @ApiProperty({ description: 'Categories', required: false, example: ['cate 1', 'cate 2'] })
    categories: string[];

    @ApiProperty({ description: 'Quantity', required: false, example: '100' })
    quantity: number;

    @ApiProperty({ description: 'is Sale', required: false, example: true })
    isSale: boolean;
}

export const vUpdateProductDTO = joi.object<UpdateProductDTO>({
    name: productValidateSchema.name.failover(''),
    description: productValidateSchema.description.failover(''),
    details: productValidateSchema.details.failover(''),
    price: productValidateSchema.price.failover(null),
    quantity: productValidateSchema.quantity.failover(null),
    isSale: productValidateSchema.isSale.failover(null),
    categories: joi.string().failover(null),
});
