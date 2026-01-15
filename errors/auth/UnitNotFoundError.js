const ApiError = require('../ApiError');

class UnitNotFoundErrorError extends ApiError {
    constructor(message) {
        super(message || 'unit not found. ', 404);
    }
}

module.exports = UnitNotFoundErrorError;