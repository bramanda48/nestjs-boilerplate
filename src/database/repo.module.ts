import { CacheModule, Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repo } from "./repo.service";
import { UniqueCodeEntity } from "./entity/unique_code.entity";
import { UserEntity } from "./entity/user.entity";

@Global()
@Module({
    imports: [
        // Load entity
        TypeOrmModule.forFeature([
            UserEntity,
            UniqueCodeEntity
        ]),

        // Cache module
        CacheModule.register({
            store: 'memory',
            isCacheableValue: ((value) => {
                return value !== null && value !== false && value !== undefined;
            })
        }),
    ],
    providers: [Repo],
    exports: [Repo]
})
export class RepoModule {}