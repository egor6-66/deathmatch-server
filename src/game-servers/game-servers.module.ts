import { Module } from '@nestjs/common';

import GameServersResolver from './game-servers.resolver';
import GameServersService from './game-servers.service';

@Module({
    providers: [GameServersService, GameServersResolver],
})
class GameServersModule {}

export default GameServersModule;
