import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from 'src/core/models/address';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from 'src/core/repositories/address.repository';
import { Connection } from 'typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common/utils';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Address]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
    controllers: [AddressController],
    providers: [AddressService, { provide: AddressRepository, useFactory: (connection: Connection) => connection.getCustomRepository(AddressRepository), inject: [Connection] }],
})
export class AddressModule {}
