var _ = require('lodash');
var Converter = require('./converter');

function NumberConverter() {
	
	var self = new Converter();
	
	self.name = 'N';
	self.dynamoDBType = 'N';
	
	self.serializeObject = function serializeDate(value) {
		if (_.isNumber(value)) {
			return value.toString();
		}
		
		if (value) {
			var convertedNumber = Number(value);
			if (!isNaN(convertedNumber)) {
				return convertedNumber.toString();
			}	
		}
		
		throw new Error('Cannot serialize Number. The value is not a Number or convertable to a Number.');
	};
		
	self.deserializeObject = function deserializeDate(value) {
		return Number(value);
	};
	
	self.isValid = function isNumberValid(value) {
		
		// first check to see whether it's a number or not first to prevent bad falsey
		if (_.isNumber(value)) {
			return true;
		}
		
		// bail when it's falsey at this point
		if (!value) {
			return false;
		}
		
		// try converting it to a number
		var convertedNumber = Number(value);
		if (!isNaN(convertedNumber)) {
			return true;
		}
		
		// no way it's going to a number
		return false;
		
	};
	
	return self;
	
};

module.exports = NumberConverter;