import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './app.logger';
import { AppModule } from './app.module';
import Helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
    // Get logger
    const logger = (process.env.NODE_ENV === 'production') ? 
        WinstonModule.createLogger(winstonConfig) : 
        new Logger('Bootstrap Logger');

    const app = await NestFactory.create(AppModule, {
        logger: logger
    });

    // Get config
    const config = app.get<ConfigService>(ConfigService);
    const environment = config.get<string>('NODE_ENV');
    const port = config.get<string>('server.port')??'5000';

    // Secure app by setting various HTTP headers.  
    app.use(Helmet());

    // Enable gzip compression.
    app.use(compression());

    // Add swagger document
    const document = new DocumentBuilder()
        .setTitle('Nestjs Boilerplate')
        .setVersion('1.0')
        .setContact('John Doe', 'http://www.example.com', 'example@mailinator.com')
        .setDescription('Typescript, PostgreSQL, TypeORM, Swagger for Api documentation, Passport-JWT authentication, Jest, Env configuration, Migrations, Seeds, Docker, Redis, AWS S3, and best application architecture.')
        .addBearerAuth({
            in: 'header', 
            type: 'http', 
            scheme: 'bearer', 
            bearerFormat: 'JWT'
        }, 'Authorization')
        .addApiKey({
            in: 'query', 
            type: 'apiKey',
            description: 'To access the private resources or asset, you need user\'s storage token. <br/><b>Get the token at the response of /auth/login or RPC Auth.Login in <font color=#c0392b>Core Microservice</font>.</b>'
        }, 'token');

    if (environment === 'development') {
        app.enableCors();

        // Swagger only enable in development mode       
        const swagger = SwaggerModule.createDocument(app, document.build());
        SwaggerModule.setup('docs', app, swagger);
    }

    logger.log(`Application is running in "${environment}" mode`);
    await app.listen(port);
}
bootstrap();
