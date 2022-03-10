import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {

    @Get()
    getHello(): {
        message: string
    } {
        return {
            message: "Welcome to NestJS Boilerplate"
        };
    }
}