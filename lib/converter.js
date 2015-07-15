// types and thier rules for conversion between dynamodb types and javascript
function Converter() {
	
	var self = {};
	
	// the name of the type must be defined by inheriting class
	self.name = null;
	
	// the underlying dynamodb type name
	self.dynamoDBType = null;
		
	// placeholder to be overridden
	self.serializeObject = null;
	
	// placeholder to be overridden	
	self.deserializeObject = null;
	
	self.fromAttributeValue = function convertAttributeValueToObject(value) {
		if (value) {
			if (value.NULL) {
				return null;
			}
			var innerValue = value[self.dynamoDBType];
			if (innerValue === null) {
				return null;
			}
			if (self.deserializeObject) {
				return self.deserializeObject(innerValue);
			}
			return innerValue;
		}
		return undefined;
	};
	
	self.toAttributeValue = function convertObjectToAttributeValue(value) {
		if (value === undefined) {
			return undefined;
		}
		if (value === null) {
			return { NULL: true };
		}
		var attributeValue = {};
		var innerValue;
		if (self.serializeObject) {
			innerValue = self.serializeObject(value);
		} else {
			innerValue = value;
		}
		attributeValue[self.dynamoDBType] = innerValue;
		return attributeValue;
	};
	
	self.toAttributeUpdate = function convertObjectToAttributeValue(value, action) {
		if (value === undefined) {
			return undefined;
		}
		return {
			Action: action,
			Value: self.toAttributeValue(value)
		};
	};
	
	self.isValid = function isObjectValid(value) {
		if (value) {
			return true;
		} else {
			return false;
		}
	};
	
	return self;
	
};

module.exports = Converter;