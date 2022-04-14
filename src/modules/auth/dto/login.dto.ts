import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginEmailDto {

    @ApiProperty({
        example: 'test@mailinator.com'
    })
    @Transform(({ value }) => value.toLowerCase().trim())
    @IsEmail()
    @IsNotEmpty()
    username?: string;

    @ApiProperty()
    @IsNotEmpty()
    password?: string;
}

export class LoginProviderDto {

    @ApiProperty()
    @IsNotEmpty()
    code?: string;
}