import { Injectable } from '@nestjs/common';
import { User } from 'src/core/models';
import { Address } from 'src/core/models/address';
import { AddressRepository } from 'src/core/repositories/address.repository';

@Injectable()
export class AddressService {
    constructor(private readonly addressRepository: AddressRepository) {}

    private addressWithUser = this.addressRepository.createQueryBuilder('address').leftJoinAndSelect('address.user', 'user');

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

    async getAddressByField(field: keyof Address, value: any): Promise<Address> {
        return await this.addressWithUser.where(`address.${field} = :value`, { value }).getOne();
    }

    async getAddressByFields(fields: { [key in keyof Address]?: any }): Promise<Address> {
        return await this.addressWithUser.where(fields).getOne();
    }

    async saveAddress(address: Address): Promise<Address> {
        return await this.addressRepository.save(address);
    }

    async saveAddresses(addresses: Address[]): Promise<Address[]> {
        return await this.addressRepository.save(addresses);
    }

    async deleteAddress(address: Address): Promise<Address> {
        await this.addressRepository.remove(address);
        return address;
    }
}
