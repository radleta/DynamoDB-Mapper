var Converter = require('./converter');

function StringConverter() {
	this.name = 'S';
	this.dynamoDBType = 'S';
};

StringConverter.prototype = new Converter();

StringConverter.prototype.isEmpty = function isStringEmpty(value) {
	return !value || value.length === 0;
};
	
StringConverter.prototype.isValid = function isStringValid(value) {
	return !value || typeof value === 'string';
};

module.exports = StringConverter;