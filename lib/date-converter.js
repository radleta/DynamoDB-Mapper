var Converter = require('./converter');

function DateConverter() {
	this.name = 'D';
	this.dynamoDBType = 'S';
};

DateConverter.prototype = new Converter();

DateConverter.prototype.serializeObject = function serializeDate(value) {
	return value.toISOString();
};
	
DateConverter.prototype.deserializeObject = function deserializeDate(value) {
	return new Date(value);
};

DateConverter.prototype.isEmpty = function isNumberEmpty(value) {
	return value === undefined;
};
	
DateConverter.prototype.isValid = function isNumberValid(value) {
	if (!value) {
		return false;
	}
	var dateWrapper = new Date(value);
	return !isNaN(dateWrapper.getDate());
};

module.exports = DateConverter;