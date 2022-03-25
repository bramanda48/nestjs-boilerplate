import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @CreateDateColumn({
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    @ApiProperty()
    @UpdateDateColumn({
        type: 'timestamp without time zone',
    })
    updated_at?: Date;

    @ApiProperty()
    @DeleteDateColumn({
        type: 'timestamp without time zone',
    })
    deleted_at?: Date;
}