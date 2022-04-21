import { ServiceRegistryModule } from "@bramanda48/nestjs-service-registry";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurationYaml from './app.config';
import { AppController } from './app.controller';
import { typeOrmConfigAsync } from './database/config/typeorm.config';
import { SharedModule } from './modules/shared.module';

@Module({
    imports: [
        // Load config
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurationYaml]
        }),

        // Service registry module
        ServiceRegistryModule.forRoot({
            'mode': 'server'
        }),
        
        // Typeorm module
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),

        // Rate limiting
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),

        SharedModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
