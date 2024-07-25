import { Module } from '@nestjs/common';

import ClientAppResolver from './client-app.resolver';
import ClientAppService from './client-app.service';

@Module({
    providers: [ClientAppResolver, ClientAppService],
})
class ClientAppModule {}

export default ClientAppModule;
