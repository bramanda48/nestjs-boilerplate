import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotAcceptableException,
    Param,
    Patch,
    Post,
    UseGuards
    } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags
    } from '@nestjs/swagger';
import configurationYaml from '../../../app.config';
import { SessionData, SessionDto } from '../../../common/decorators/session.decorator';
import { TokenType } from '../../../common/dto/token-type.dto';
import { Repo } from '../../../database/repo.service';
import { EmailService } from '../../notification/services/email.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginEmailDto, LoginProviderDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordCodeDto, ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly repo: Repo,
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
    ) {}

    @Post('/login/email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Request an authentication token',
    })
    async login(
        @Body() loginDto: LoginEmailDto
    ) {
        const validateEmail = await this.authService.loginEmail(loginDto);
        return {
            access_token: validateEmail.token,
            token_type: 'bearer',
            expires_in: this.repo.config.get<number>('auth.jwt.expiresIn'),
        };      
    }
    
    @Post('/login/provider/:name')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Request an authentication token using social account',
    })
    @ApiParam({
        name: 'name',
        enum: (() => {
            let config = configurationYaml();
            return config['auth']['providers'].map(x => x.name);
        })()
    })
    async loginProviders(
        @Param('name') name: string,
        @Body() loginDto: LoginProviderDto
    ) {
        const {token} = await this.authService.loginProviders(loginDto, name);
        return {
            access_token: token,
            token_type: 'bearer',
            expires_in: this.repo.config.get<number>('auth.jwt.expiresIn'),
        }; 
    }

    @Post('/register')
    @ApiOperation({
        summary: 'Register a user using email',
    })
    async register(
        @Body() registerDto: RegisterDto
    ) {
        const {user, isNewUser} = await this.authService.registerOrUpdateUsers(registerDto);
        if(!isNewUser) {
            throw new NotAcceptableException('USER_REGISTERED');
        }
        // Send Email
        const {token} = await this.authService.createToken(TokenType.VerifyEmail, user.id, 3*24*60);
        const verificationUrl = `${this.repo.config.get('server.frontendUrl')}/auth/verify/${token}`;
        this.emailService.send({
            to: {
                name: user.name,
                address: user.email
            },
            subject: 'Welcome to Nestjs Boilerplate',
            template: 'user-verification',
            context: {
                link: verificationUrl
            }
        });
        return {
            message: 'EMAIL_SENT',
        };
    }

    @Get('/verify/:code')
    @ApiOperation({
        summary: 'Verfiy user email',
    })
    async verifyUser(
        @Param('code') verifyUserDto: VerifyUserDto
    ) {
        await this.authService.verifyUser(verifyUserDto.code);
        return {
            message: 'USER_ACTIVATED',
        };
    }

    @Post('/forgot/password')
    async forgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto
    ) {
        const {user, token} = await this.authService.forgotPassword(forgotPasswordDto.username);
        const verificationUrl = `${this.repo.config.get('server.frontendUrl')}/auth/reset/password/${token}`;
        //Send Email
        this.emailService.send({
            to: {
                name: user.name,
                address: user.email
            },
            subject: 'Forgot Password',
            template: 'user-forgot-password',
            context: {
                link: verificationUrl
            }
        });
        return {
            message: 'EMAIL_SENT',
        };
    }

    @Get('/reset/password/:code')
    async resetPassword(
        @Param('code') resetPasswordCodeDto: ResetPasswordCodeDto,
        @Body() resetPasswordDto: ResetPasswordDto
    ) {
        await this.authService.resetPassword(resetPasswordCodeDto.code, resetPasswordDto.new_password);
        return {
            message: 'SUCCESS',
        };
    }

    @Get('/me')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get user profile',
    })
    @UseGuards(AuthGuard())
    async getProfile(
        @SessionData() session: SessionDto
    ) {
        return session.user;
    }

    @Patch('/me')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update user profile',
    })
    @UseGuards(AuthGuard())
    async updateProfile(
        @SessionData() session: SessionDto,
        @Body() registerDto: RegisterDto
    ) {
        return await this.authService.registerOrUpdateUsers(registerDto);
    }

    @Delete('/me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async delete() {

    }
}