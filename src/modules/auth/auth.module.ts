import { Module } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [JwtGuard],
})
export class AuthModule {}
