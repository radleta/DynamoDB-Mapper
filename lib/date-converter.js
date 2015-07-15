var _ = require('lodash');
var Converter = require('./converter');

/** Converter to convert from Date to DynamoDB representation of a date. */
function DateConverter() {
	
	var self = new Converter();
	
	self.name = 'D';
	self.dynamoDBType = 'S';
	
	self.serializeObject = function serializeDate(value) {
		
		if (value) {
			
			// try to conver to Date when not date
			if (!_.isDate(value))
			{
				value = new Date(value);
			}
			
			if (!isNaN(value.getDate())) {
				return value.toISOString();
			}
			
		}
		
		throw new Error('Cannot serialize Date. The value is not a Date or convertable to a Date.');
		
	};
	
	self.deserializeObject = function deserializeDate(value) {
		return new Date(value);
	};
	
	self.isValid = function isNumberValid(value) {
		if (!value) {
			return false;
		}
		if (_.isDate(value)) {
			return true;
		}
		var dateWrapper = new Date(value);
		return !isNaN(dateWrapper.getDate());
	};
	
	return self;
	
};

module.exports = DateConverter;