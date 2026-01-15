const ApiError = require('./ApiError');
const DataFormatError = require('./DataFormatError');

// 커스텀 에러는 모두 여기에서 export
module.exports = {
    ApiError,
    DataFormatError,
    ...require('./auth'),
};