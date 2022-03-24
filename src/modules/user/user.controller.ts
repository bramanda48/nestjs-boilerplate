import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/database';
import { PagininationDto } from 'src/common/dto';

@ApiTags('Users')
@ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
})
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    @ApiOperation({summary: 'Add one user' })
    @ApiCreatedResponse({description: 'Created.'})
    create(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all user' })
    @ApiOkResponse({description: 'Get data sucess.'})
    findAll(
        @Query() pagination: PagininationDto,
    ) {
        return this.userService.findAll({
            page: pagination.page,
            limit: pagination.limit
        });
    }

    @Get(':id')
    @ApiOperation({summary: 'Get one user' })
    @ApiOkResponse({description: 'Get data sucess.'})
    findOne(
        @Param('id') id: string
    ) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update one user' })
    @ApiOkResponse({description: 'User updated.'})
    @ApiNotFoundResponse({description: 'User not found.'})
    update(
        @Param('id') id: string, 
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete one user' })
    @ApiOkResponse({description: 'Delete succesfully.'})
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
