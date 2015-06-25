var Converter = require('./converter');

function NumberConverter() {
	this.name = 'N';
	this.dynamoDBType = 'N';
};

NumberConverter.prototype = new Converter();

NumberConverter.prototype.serializeObject = function serializeDate(value) {
	return value.toString();
};
	
NumberConverter.prototype.deserializeObject = function deserializeDate(value) {
	return Number(value);
};

NumberConverter.prototype.isEmpty = function isNumberEmpty(value) {
	return value === undefined || isNaN(value);
};
	
NumberConverter.prototype.isValid = function isNumberValid(value) {
	return !value || !isNaN(value);
};

module.exports = NumberConverter;