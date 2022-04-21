import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { GraphqlService } from './graphql/graphql.service';

@Injectable()
export class Repo {
    constructor(
        public readonly config: ConfigService,
        public readonly graphql: GraphqlService,
        @InjectRepository(UserEntity) public readonly userEntity: Repository<UserEntity>,
    ) {}
}