import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {

    @Get()
    @Version(VERSION_NEUTRAL)
    getHello(): {
        message: string
    } {
        return {
            message: "Welcome to NestJS Boilerplate"
        };
    }
}