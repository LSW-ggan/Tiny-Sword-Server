const ApiError = require('../ApiError');

class UserNotFoundErrorError extends ApiError {
    constructor(message) {
        super(message || 'user not found. ', 404);
    }
}

module.exports = UserNotFoundErrorError;