import {
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength
    } from 'class-validator';

export class ResetPasswordDto {

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too weak' },
    )
    new_password: string;
}

export class ResetPasswordCodeDto {

    @IsNotEmpty()
    code: string;
}