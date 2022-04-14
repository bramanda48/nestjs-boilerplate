
export class ValidateLoginDto {
    // if using email and password
    username?: string;
    password?: string;

    // if using code provider
    code?: string;
}