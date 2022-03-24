import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
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
    
    // Set global prefix
    app.setGlobalPrefix('api', {
        exclude: ['/'],
    });

    // Enable api versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Secure app by setting various HTTP headers.  
    app.use(Helmet());

    // Enable gzip compression.
    app.use(compression());

    // Add validation pipe
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );

    // Add swagger document
    const document = new DocumentBuilder()
        .setTitle('Nestjs Boilerplate')
        .setVersion('1.0')
        .setContact('John Doe', 'http://www.example.com', 'example@mailinator.com')
        .setDescription(
            `<p>Documentation for the Nestjs Boilerplate <p/>` +
            `<p>Official website: <a target="_blank" href="https://example.com">https://example.com</a><br/>` +
            `Additional documentation: <a target="_blank" href="https://docs.example.com">https://docs.example.com</a> <br/>` +
            `Source code: <a target="_blank" href="hhttps://github.com/bramanda48/nestjs-boilerplate">https://github.com/bramanda48/nestjs-boilerplate</a></p>`,
        );

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
