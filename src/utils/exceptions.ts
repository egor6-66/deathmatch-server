import { AuthenticationError } from '@nestjs/apollo';

class Exception {
    unauthorized() {
        throw new AuthenticationError('Unauthorized');
    }
}

export default new Exception();
