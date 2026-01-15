const ApiError = require('../ApiError');

class DuplicateEmailError extends ApiError {
    constructor(message) {
        super(message || 'Duplicate email', 409);
    }
}

module.exports = DuplicateEmailError;