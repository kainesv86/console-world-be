import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from './product-category';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Id' })
    id: number;

    @Column()
    @ApiProperty({ description: 'Name' })
    name: string;

    @Column()
    @ApiProperty({ description: 'Description' })
    description: string;

    @Column('longtext', { default: null })
    @ApiProperty({ description: 'Details' })
    details: string;

    @Column()
    @ApiProperty({ description: 'Price' })
    price: number;

    @Column()
    @ApiProperty({ description: 'createDate' })
    createAt: string;

    @Column()
    @ApiProperty({ description: 'updateDate' })
    updateAt: string;

    @Column()
    @ApiProperty({ description: 'Image' })
    imageUrl: string;

    @Column()
    @ApiProperty({ description: 'Quantity', default: 0 })
    quantity: number;

    @Column()
    @ApiProperty({ description: 'is Sale' })
    isSale: boolean;

    @ApiProperty({ description: 'Categories', nullable: true })
    @OneToMany(() => ProductCategory, (category) => category.product)
    categories: ProductCategory[];
}

export const productValidateSchema = {
    name: joi
        .string()
        .required()
        .trim()
        .min(3)
        .max(100)
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 100 })),

    description: joi
        .string()
        .trim()
        .min(0)
        .max(500)
        .messages(JoiMessage.createStringMessages({ field: 'Description', min: 0, max: 500 })),
    details: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Details', min: 3, max: 100 })),

    price: joi
        .number()
        .required()
        .min(0)
        .max(1000000)
        .messages(JoiMessage.createNumberMessages({ field: 'Price' })),
    quantity: joi
        .number()
        .min(0)
        .max(1000000)
        .messages(JoiMessage.createNumberMessages({ field: 'Quantity' })),
    isSale: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'isSale' })),
};
