import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { enums } from '@utils';

const typeorm = (entities: any[]): TypeOrmModuleAsyncOptions => ({
    imports: [ConfigModule],

    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(enums.Env.POSTGRES_HOST),
        port: +configService.get(enums.Env.POSTGRES_PORT),
        username: configService.get(enums.Env.POSTGRES_USER),
        password: configService.get(enums.Env.POSTGRES_PASSWORD),
        database: String(configService.get(enums.Env.POSTGRES_DB)),
        entities: entities,
        synchronize: String(configService.get(enums.Env.NODE_ENV)) === 'dev',
    }),
});

export default typeorm;
