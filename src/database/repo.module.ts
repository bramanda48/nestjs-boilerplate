import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity";
import { Repo } from "./repo.service";

@Global()
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