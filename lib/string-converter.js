var _ = require('lodash');
var Converter = require('./converter');

function StringConverter() {
	
	var self = new Converter();

	self.name = 'S';
	self.dynamoDBType = 'S';

	self.isValid = function isStringValid(value) {
		// dynamodb requires string and is NOT empty
		return _.isString(value) && value.length > 0;
	};
	
	return self;
	
};

module.exports = StringConverter;