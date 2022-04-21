import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export default class TypeOrmConfig {
    static getConfig(config: ConfigService): TypeOrmModuleOptions {
        return {
            type: config.get('db.type'),
            url: config.get('db.url'),
            synchronize: config.get<boolean>('db.synchronize'),
            migrationsRun: config.get<boolean>('db.migrationsRun'),
            autoLoadEntities: false,
            entities: [
                join(__dirname, '..', 'entity', '*.entity.{js,ts}')
            ],
            migrations: [
                join(__dirname, '..', 'migrations', '*.{ts,js}')
            ],
            cli: {
                migrationsDir: join('src', 'database' ,'migrations')
            }
        }
    }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): 
        Promise<TypeOrmModuleOptions> => {
        return TypeOrmConfig.getConfig(configService);
    },
    inject: [ConfigService]
}  