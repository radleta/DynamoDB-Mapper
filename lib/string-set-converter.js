var Converter = require('./converter');

function StringSetConverter() {
	this.name = 'SS';
	this.dynamoDBType = 'SS';
};

StringSetConverter.prototype = new Converter();

StringSetConverter.prototype.isEmpty = function isStringSetEmpty(value) {
	return !value || value.length === 0;
};

StringSetConverter.prototype.isValid = function isStringSetValid(value) {
	return !value || typeof value === 'array';
};

module.exports = StringSetConverter;
