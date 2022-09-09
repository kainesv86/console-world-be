import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Address {
    @Column()
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @ApiProperty({ description: 'Address' })
    @Column({ default: null, unique: true })
    address: string;

    @ApiProperty({ description: 'User Id' })
    @ManyToOne(() => User, (user) => user.address)
    user: User;
}
