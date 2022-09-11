import { Injectable } from '@nestjs/common';
import { User } from 'src/core/models';
import { Address } from 'src/core/models/address';
import { AddressRepository } from 'src/core/repositories/address.repository';

@Injectable()
export class AddressService {
    constructor(private readonly addressRepository: AddressRepository) {}

    async createOne(location: string, phone: string, user: User): Promise<Address> {
        const address = new Address();
        address.location = location;
        address.phone = phone;
        address.user = user;
        await this.addressRepository.save(address);
        return address;
    }
    async getAddresses(user: User): Promise<Address[]> {
        return await this.addressRepository.find({ where: { user } });
    }
}
