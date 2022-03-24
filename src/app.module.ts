import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/config';
import configurationYaml from './app.config';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './modules/shared.module';

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
