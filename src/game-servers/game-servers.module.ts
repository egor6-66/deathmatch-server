import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UsersModule from '../users/users.module';

import GameServer from './game-servers.model';
import GameServersResolver from './game-servers.resolver';
import GameServersService from './game-servers.service';

@Module({
    providers: [GameServersService, GameServersResolver],
    imports: [TypeOrmModule.forFeature([GameServer]), UsersModule],

    exports: [GameServersService],
})
class GameServersModule {}

export default GameServersModule;
