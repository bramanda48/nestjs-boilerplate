import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../../common/guards/jwt.strategy";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor() {}

    @Get('/profile')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    async profile(
        @Req() req: any,
    ) {
        return req.user;
    }
}