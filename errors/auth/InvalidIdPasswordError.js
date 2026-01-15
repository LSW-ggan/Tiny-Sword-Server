const ApiError = require('../ApiError');

class InvalidIdPasswordError extends ApiError {
    constructor(message) {
        super(message || 'Invalid user ID or password. ', 401);
    }
}

module.exports = InvalidIdPasswordError;