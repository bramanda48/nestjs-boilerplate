import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

export default class TypeOrmConfig {
    static getConfig(config: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: config.get('db.host'),
            port: config.get<number>('db.port'),
            username: config.get('db.username'),
            password: config.get('DB_PASSWORD'),
            database: config.get('db.name'),
            synchronize: config.get<boolean>('synchronize'),
            migrationsRun: config.get<boolean>('migrationsRun'),
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