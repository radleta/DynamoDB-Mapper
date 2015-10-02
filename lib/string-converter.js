var _ = require('lodash');
var Converter = require('./converter');

function StringConverter() {
	
	var self = new Converter();
	var base = {};
	
	self.name = 'S';
	self.dynamoDBType = 'S';

	self.isValid = function isStringValid(value) {
		// dynamodb requires string and is NOT empty
		return _.isString(value) && value.length > 0;
	};

	// remember the base implementation
	base.toAttributeValue = self.toAttributeValue.bind(self);

	self.toAttributeValue = function convertObjectToAttributeValue(value) {
		if (value === undefined) {
			return undefined;
		}
		if (value === null || value.length === 0) {
			return { NULL: true };
		}
		return base.toAttributeValue(value);
	};

	// remember the base implementation
	base.toAttributeUpdate = self.toAttributeUpdate.bind(self);

	self.toAttributeUpdate = function convertObjectToAttributeValue(value) {
		if (value === undefined) {
			return undefined;
		} else if (value === null || value.length === 0) {
			return { Action: 'DELETE' };
		}
		return base.toAttributeUpdate(value);
	};
	
	return self;
	
}

module.exports = StringConverter;