import configurationYaml from './app.config';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { typeOrmConfigAsync } from './database/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        // Load config
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurationYaml]
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
