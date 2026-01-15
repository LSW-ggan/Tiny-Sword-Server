const ApiError = require('../ApiError');

class InvalidTokenError extends ApiError {
    constructor(message) {
        super(message || 'Invalid Token.', 401);
    }
}

module.exports = InvalidTokenError;