import { AuthenticationError, ValidationError } from '@nestjs/apollo';

class Exception {
    unauthorized() {
        throw new AuthenticationError('Unauthorized');
    }

    notUnique() {
        throw new ValidationError('Not unique');
    }

    maxCount() {
        throw new ValidationError('Max count');
    }

    serverError() {
        throw new ValidationError('Server error');
    }
}

export default new Exception();
