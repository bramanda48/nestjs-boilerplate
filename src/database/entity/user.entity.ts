import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract.entity";

@Entity({name: 'user'})
export class UserEntity extends AbstractEntity {

    @Column({
        type: 'varchar', 
        length: 100,
        nullable: true,
        comment: 'Name'
    })
    name: string;

    @Column({
        type: 'varchar', 
        length: 50,
        nullable: true,
        comment: 'Email address'
    })
    email: string;

    @Column({
        type: 'varchar', 
        length: 200, 
        comment: 'Password hash using bcrypt'
    })
    password: string;
}