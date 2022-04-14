import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    Matches,
    MaxLength,
    MinLength
    } from 'class-validator';

export class RegisterDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    username?: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too weak' },
    )
    password?: string;

    @ApiProperty()
    @IsNotEmpty()
    name?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}