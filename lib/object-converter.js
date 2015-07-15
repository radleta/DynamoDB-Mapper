var Converter = require('./converter');

function ObjectConverter() {
	
	var self = new Converter();
	
	self.name = 'O';
	self.dynamoDBType = 'S';
	
	self.serializeObject = function serializeDate(value) {
		return JSON.stringify(value);
	};
		
	self.deserializeObject = function deserializeDate(value) {
		return JSON.parse(value);
	};
	
	self.isValid = function isObjectValid(value) {
		return true;
	};
	
	return self;
	
};

module.exports = ObjectConverter;