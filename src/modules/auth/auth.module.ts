import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { EmailService } from '../notification/services/email.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject:  [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('auth.jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<number>('auth.jwt.expiresIn'),
                },
            }),
        }),

        // Passport
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, EmailService]
})
export class AuthModule {}