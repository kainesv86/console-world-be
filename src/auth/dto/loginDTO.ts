import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema } from '../../core/models';
export class LoginDTO {
    @ApiProperty({ description: 'Username', example: 'kainesv86@gmail.com' })
    email: string;

    @ApiProperty({ description: 'Password', example: '123456Aa' })
    password: string;
}

export const vLoginDTO = joi.object<LoginDTO>({
    email: userValidateSchema.email,
    password: userValidateSchema.password,
});
