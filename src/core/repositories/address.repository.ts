import { EntityRepository } from 'typeorm';
import { Address } from '../models/address';
import { RepositoryService } from './repository';

@EntityRepository(Address)
export class AddressRepository extends RepositoryService<Address> {}
