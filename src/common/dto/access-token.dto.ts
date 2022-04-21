import { TokenType } from "./token-type.dto"

export class AccessTokenDto {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    nonce: string;
    roles: string[];
    scope: string[];
    sub: number;
    token_type: TokenType;
}