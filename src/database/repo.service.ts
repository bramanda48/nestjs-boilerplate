import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";
import { UniqueCodeEntity } from "./entity/unique_code.entity";
import { UserEntity } from "./entity/user.entity";

@Injectable()
export class Repo {
    constructor(
        public readonly config: ConfigService,
        @Inject(CACHE_MANAGER) public readonly cacheManager: Cache,
        @InjectRepository(UserEntity) public readonly userEntity: Repository<UserEntity>,
        @InjectRepository(UniqueCodeEntity) public readonly uniqueCodeEntity: Repository<UniqueCodeEntity>,
    ) {}
}