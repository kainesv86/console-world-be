import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

@Entity()
export class ProductCategory {
    @Column()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;
}

export const productCategoryValidateSchema = {
    name: joi
        .string()
        .required()
        .min(3)
        .max(50)
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 50 })),
};
