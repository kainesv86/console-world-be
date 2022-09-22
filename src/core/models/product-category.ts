import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product';

@Entity()
export class ProductCategory {
    @Column()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Id' })
    id: string;

    @Column({ unique: true })
    @ApiProperty({ description: 'Name' })
    name: string;

    @ManyToOne(() => Product, (product) => product.categories)
    product: Product;
}

export const productCategoryValidateSchema = {
    name: joi
        .string()
        .required()
        .min(3)
        .max(50)
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 50 })),
};
