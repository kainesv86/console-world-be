import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResponseMessage } from '../interface';
import { User } from './user';

@Entity()
export class Address {
    @Column()
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @ApiProperty({ description: 'Address' })
    @Column({ nullable: false })
    location: string;

    @ApiProperty({ description: 'Phone' })
    @Column({ nullable: false })
    phone: string;

    @ApiProperty({ description: 'User Id' })
    @ManyToOne(() => User, (user) => user.addresses)
    user: User;
}

export const addressValidateSchema = {
    location: joi
        .string()
        .min(5)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Address', min: 5, max: 255 })),
    phone: joi
        .string()
        .min(10)
        .max(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({ ...JoiMessage.createStringMessages({ field: 'Phone number', min: 10, max: 11 }), 'string.pattern.base': ResponseMessage.INVALID_PHONE }),
};
