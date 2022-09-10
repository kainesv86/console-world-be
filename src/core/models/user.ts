import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { joiPasswordExtendCore, JoiPasswordExtend } from 'joi-password';
import * as joi from 'joi';
import { Address } from './address';
import JoiMessage from 'joi-message';
import { ResponseMessage } from '../interface';

const joiPassword: JoiPasswordExtend = joi.extend(joiPasswordExtendCore);

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
@Entity()
export class User {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Password' })
    @Column({ default: null })
    password: string;

    @ApiProperty({ description: 'Email' })
    @Column({ default: null, unique: true })
    email: string;

    @ApiProperty({ description: 'Phone' })
    @Column({ default: null })
    phone: string;

    @ApiProperty({ description: 'Is verify' })
    @Column({ default: true })
    isVerified: boolean;

    @ApiProperty({ description: 'Google id' })
    @Column({ default: null, unique: true })
    googleId: string;

    @ApiProperty({ description: 'Address' })
    @Column({ default: null, unique: true })
    address: string;

    @ApiProperty({ description: 'Create date' })
    createAt: number;

    @ApiProperty({ description: 'Create date' })
    updateAt: number;

    @ApiProperty({ description: 'Status' })
    @Column({ default: UserStatus.ACTIVE })
    status: UserStatus;

    @ApiProperty({ description: 'Status' })
    @Column({ default: UserRole.USER })
    role: UserRole;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];
}

export const userValidateSchema = {
    name: joi
        .string()
        .min(5)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Full name', min: 5, max: 40 })),
    email: joi
        .string()
        .min(5)
        .max(255)
        .email()
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Email', min: 5, max: 255 })),
    username: joi
        .string()
        .max(32)
        .min(5)
        .lowercase()
        .alphanum()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Username', min: 5, max: 32 })),
    password: joiPassword
        .string()
        .min(8)
        .max(32)
        .noWhiteSpaces()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Password', min: 8, max: 32 })),
    phone: joi
        .string()
        .min(10)
        .max(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({ ...JoiMessage.createStringMessages({ field: 'Phone number', min: 10, max: 11 }), 'string.pattern.base': ResponseMessage.INVALID_PHONE }),
};
