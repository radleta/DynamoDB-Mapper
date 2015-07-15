var _ = require('lodash');
var Converter = require('./converter');

function StringSetConverter() {
	
	var self = new Converter();
	
	self.name = 'SS';
	self.dynamoDBType = 'SS';
	
	self.isValid = function isStringSetValid(value) {
		return _.isArray(value);
	};
	
	return self;
	
}

module.exports = StringSetConverter;
