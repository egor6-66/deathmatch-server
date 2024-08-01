import { AuthenticationError, ValidationError } from '@nestjs/apollo';

class Exception {
    unauthorized() {
        throw new AuthenticationError('Unauthorized');
    }

    notUnique() {
        throw new ValidationError('Not unique');
    }
}

export default new Exception();
