const ApiError = require('../ApiError');

class InvalidPasswordError extends ApiError {
    constructor(message) {
        super(message || 'Invalid Password. ', 401);
    }
}

module.exports = InvalidPasswordError;