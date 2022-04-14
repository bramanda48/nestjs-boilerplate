import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException
    } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload, verify as JwtVerify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SessionDto } from '../../../common/decorators/session.decorator';
import { ConfigProviders } from '../../../common/dto/config-providers.dto';
import { TokenType } from '../../../common/dto/token-type.dto';
import { IAuthServiceProvider } from '../../../common/interfaces/auth-service-providers.interface';
import { UserEntity } from '../../../database/entity/user.entity';
import { Repo } from '../../../database/repo.service';
import { RegisterDto } from '../dto/register.dto';
import { ValidateLoginDto } from '../dto/validate-login.dto';
import * as providers from '../providers';

@Injectable()
export class AuthService {
    constructor(
        private readonly repo: Repo,
        private readonly jwtService: JwtService,
    ) {}

    async loginEmail(
        loginDto: ValidateLoginDto
    ): Promise<{token: string, user: UserEntity, isNewUser: boolean}> {
        let user: UserEntity = await this.repo.userEntity.findOne({
            where: {
                email: loginDto.username
            }
        });
        if(!user) {
            throw new UnauthorizedException('INVALID_CREDENTIAL');
        }
        if(!user.is_active) {
            throw new UnauthorizedException('USER_INACTIVE');
        }

        // Check is valid password
        let isValidPassword = await bcrypt.compare(
            loginDto.password,
            user.password
        );
        if(!isValidPassword) {
            throw new UnauthorizedException('INVALID_CREDENTIAL');
        }

        // Create token
        let {uuid, token} = await this.createToken(TokenType.LoginPassword, user.id);

        // Save session in cache
        this.repo.cacheManager.set(uuid, new SessionDto(
            uuid, // uuid == sessionId
            user,
        ), {
            ttl: this.repo.config.get<number>('auth.jwt.expiresIn')
        });
        return {token, user, isNewUser: false};
    }
    
    async loginProviders(
        loginDto: ValidateLoginDto, name: string
    ): Promise<{token: string, user: UserEntity, isNewUser: boolean}> {   
        let checkProvider = this.getProviders(name) as ConfigProviders;
        if(!checkProvider) {
            throw new BadRequestException('INVALID_PROVIDER')  
        } 
        const provider = new providers[checkProvider.className]() as IAuthServiceProvider;
        const respUser = await provider.getUser(loginDto.code);
        
        let isNewUser = false;
        let user: UserEntity = await this.repo.userEntity.findOne({
            where: {
                email: respUser.email
            }
        });
        if(!user) {
            const register = await this.registerOrUpdateUsers({
                name: respUser.name,
                username: respUser.email,
                is_active: true,
            });
            isNewUser = register.isNewUser;
            user = register.user;
        }
        if(!user.is_active) {
            throw new UnauthorizedException('USER_INACTIVE');
        }

        // Create token
        let {uuid, token} = await this.createToken(TokenType.LoginProvider, user.id);

        // Save session in cache
        this.repo.cacheManager.set(uuid, new SessionDto(
            uuid, // uuid == sessionId
            user
        ), {
            ttl: this.repo.config.get<number>('auth.jwt.expiresIn')
        });
        return {token, user, isNewUser};
    }

    async registerOrUpdateUsers(
        registerDto: RegisterDto,
    ): Promise<{user: UserEntity, isNewUser: boolean}> {
        let isNewUser = true;
        let user: UserEntity = await this.repo.userEntity.findOne({
            where: {
                email: registerDto.username
            }
        });
        if(user) {
            isNewUser = false;
            user.email = registerDto.username;
            user.password = await bcrypt.hash(registerDto.password, 10);
            user.name = registerDto.name;
        } else {
            user = this.repo.userEntity.create({
                email: registerDto.username,
                password: await bcrypt.hash(registerDto.password, 10),
                name: registerDto.name,
                is_active: registerDto.is_active
            });
        }

        // Save the data
        this.repo.userEntity.save(user);
        return {user, isNewUser};
    }

    async verifyUser(
        token: string
    ): Promise<boolean> {
        const tokenDecode = JwtVerify(token, this.repo.config.get('auth.jwt.secret')) as JwtPayload;
        if(tokenDecode.type != TokenType.VerifyEmail) {
            throw new UnprocessableEntityException('INVALID_VERIFICATION_CODE');
        }
        const getCode = await this.repo.uniqueCodeEntity.findOne({
            where: {
                code: tokenDecode.sub,
                type: tokenDecode.type
            },
            relations: ['user']
        });
        if(!getCode) {
            throw new UnprocessableEntityException('INVALID_VERIFICATION_CODE');
        }
        getCode.deleted_at = new Date();

        // Update is_active
        getCode.user.is_active = true;
        this.repo.userEntity.save(getCode);
        return true;
    }

    async forgotPassword(
        email: string
    ): Promise<{user: UserEntity, token: string}> {
        const user: UserEntity = await this.repo.userEntity.findOne({
            where: {
                email: email
            }
        });
        if(!user) {
            throw new UnprocessableEntityException('USER_NOT_REGISTERED');
        }
        const {token} = await this.createToken(TokenType.ResetPassword, user.id);
        return {user, token};
    }

    async resetPassword(
        token: string,
        new_password: string,
    ): Promise<boolean> {
        const tokenDecode = JwtVerify(token, this.repo.config.get('auth.jwt.secret')) as JwtPayload;
        if(tokenDecode.type != TokenType.ResetPassword) {
            throw new UnprocessableEntityException('INVALID_RESET_PASSWORD_CODE');
        }
        const getCode = await this.repo.uniqueCodeEntity.findOne({
            where: {
                code: tokenDecode.sub,
                type: tokenDecode.type
            },
            relations: ['user']
        });
        if(!getCode) {
            throw new UnprocessableEntityException('INVALID_RESET_PASSWORD_CODE');
        }
        getCode.deleted_at = new Date();

        // Update password
        getCode.user.password = await bcrypt.hash(new_password, 10);
        this.repo.userEntity.save(getCode);
        return true;
    }

    async createToken(
        type: TokenType, 
        user_id: string, 
        ttl?: number
    ): Promise<{uuid: string, token: string}> {
        let uuid: string = uuidv4();
        let token = await this.jwtService.sign({
            type: type,
            sub : uuid
        }, {
            expiresIn: ttl??this.repo.config.get<number>('auth.jwt.expiresIn')
        });

        // Save unique_code
        if([TokenType.ResetPassword, 
            TokenType.VerifyEmail].includes(type)) {
            this.repo.uniqueCodeEntity.save({
                type: type,
                code: uuid,
                user_id: user_id
            });
        }
        return {
            uuid: uuid,
            token: token
        };
    }

    getProviders(
        name?: string
    ): ConfigProviders[]|ConfigProviders  {
        let providers = this.repo.config.get<ConfigProviders[]>('auth.providers');
        if (name) {
            return providers.find(x => x.name == name) as ConfigProviders;
        } else {
            return providers;
        }  
    }
}