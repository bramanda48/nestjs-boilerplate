import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity";
import Repo from "./repo.service";

@Module({
    imports: [
        // Load entity
        TypeOrmModule.forFeature([
            UserEntity
        ]),
    ],
    providers: [Repo],
    exports: [Repo]
})
export class RepoModule {}