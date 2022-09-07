import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';

@Module({
    imports: [DbModule, UserModule, AuthModule, AddressModule],
})
export class AppModule {}
