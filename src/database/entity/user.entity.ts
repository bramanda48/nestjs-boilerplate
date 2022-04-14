import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UniqueCodeEntity } from "./unique_code.entity";

@Entity({name: 'user'})
export class UserEntity extends AbstractEntity {

    @ApiProperty()
    @Column({
        type: 'varchar', 
        length: 100,
        nullable: true,
        comment: 'Name'
    })
    name: string;

    @ApiProperty()
    @Column({
        type: 'varchar', 
        length: 50,
        nullable: true,
        comment: 'Email address'
    })
    email: string;

    @Exclude()
    @Column({
        type: 'varchar', 
        length: 200, 
        nullable: true,
        comment: 'Password hash using bcrypt'
    })
    password: string;

    @Column({
        type: 'bool',
        default: false
    })
    is_active: boolean;

    // Join column
    @OneToMany(() => UniqueCodeEntity, (column) => column.user, {
        onDelete: 'CASCADE'
    })
    uniqueCode: UniqueCodeEntity[];
}