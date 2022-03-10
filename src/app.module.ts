import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/config';
import configurationYaml from './app.config';
import { AppController } from './app.controller';

@Module({
    imports: [
        // Load config
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurationYaml]
        }),
        
        // Typeorm module
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
