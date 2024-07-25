import { Resolver } from '@nestjs/graphql';

import ClientAppModule from './client-app.module';

@Resolver()
class ClientAppResolver {}

export default ClientAppResolver;
