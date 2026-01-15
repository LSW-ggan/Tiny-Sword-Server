const ApiError = require('./ApiError');

class DataFormatError extends ApiError {
    constructor(message) {
        super(message || 'Data Format Error', 400);
    }
}

module.exports = DataFormatError;