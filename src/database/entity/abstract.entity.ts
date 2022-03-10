import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
    })
    updated_at?: Date;

    @DeleteDateColumn({
        type: 'timestamp without time zone',
    })
    deleted_at?: Date;
}