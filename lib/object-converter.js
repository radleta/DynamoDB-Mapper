var Converter = require('./converter');

function ObjectConverter() {
	this.name = 'O';
	this.dynamoDBType = 'S';
};

ObjectConverter.prototype = new Converter();

ObjectConverter.prototype.serializeObject = function serializeDate(value) {
	return JSON.stringify(value);
};
	
ObjectConverter.prototype.deserializeObject = function deserializeDate(value) {
	return JSON.parse(value);
};

ObjectConverter.prototype.isEmpty = function isObjectEmpty(value) {
	return value === undefined;
};
	
ObjectConverter.prototype.isValid = function isObjectValid(value) {
	return true;
};

module.exports = ObjectConverter;