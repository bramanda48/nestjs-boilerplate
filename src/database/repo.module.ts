import { Global, Module } from '@nestjs/common';
import { Repo } from './repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';


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