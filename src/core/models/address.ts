import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
