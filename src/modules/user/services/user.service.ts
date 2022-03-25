import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repo, UserEntity } from 'src/database';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly repo: Repo
    ) {}

    // Define logger
    private logger: Logger = new Logger(UserService.name);

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const password = await bcrypt.hash(createUserDto.password, 10);
        const saveUser = this.repo.userEntity.save({
            ...createUserDto,
            password,
        });
        return saveUser;
    }

    async findAll(pagination: IPaginationOptions): Promise<Pagination<UserEntity>> {
        return await paginate<UserEntity>(this.repo.userEntity, pagination);
    }

    async findOne(id: string): Promise<UserEntity> {
        return await this.repo.userEntity.findOne({
            where: {
                id: id
            }
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const getUser = await this.repo.userEntity.findOne({
            where: {
                id: id
            }
        });
        if(!getUser) {
            throw new NotFoundException('User not found.')
        }
        getUser.email = updateUserDto.email;
        getUser.name  = updateUserDto.name;

        // Update user
        this.repo.userEntity.save(getUser);
        return getUser;
    }

    async remove(id: string) {
        return await this.repo.userEntity.softDelete(id);
    }
}
