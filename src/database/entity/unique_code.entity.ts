import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne
    } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { TokenType } from '../../common/dto/token-type.dto';

@Entity({name: 'unique_code'})
export class UniqueCodeEntity extends AbstractEntity {

    @ApiProperty()
    @Column({
        type: 'enum', 
        enum: TokenType,
        default: TokenType.VerifyEmail
    })
    type: TokenType;

    @Column({
        type: 'varchar', 
        length: 30,
        nullable: true,
        comment: 'Unique code'
    })
    code: string;

    @ApiProperty()
    @Column({
        type: 'uuid',
        nullable: true,
    })
    user_id: string;

    // Join column
    @ManyToOne(() => UserEntity, (column) => column.uniqueCode, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity;
}