import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entity";

export default class Repo {
    constructor(
        public readonly config: ConfigService,
        @InjectRepository(UserEntity) public readonly userEntity: Repository<UserEntity>,
    ) {}
}