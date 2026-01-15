const ApiError = require('../ApiError');

class TokenExpireError extends ApiError {
    constructor(message) {
        super(message || 'Token Expired', 401);
    }
}

module.exports = TokenExpireError;