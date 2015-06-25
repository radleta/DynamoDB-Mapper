// types and thier rules for conversion between dynamodb types and javascript
function Converter() {
	// the name of the type must be defined by inheriting class
	this.name = null;
	
	// the underlying dynamodb type name
	this.dynamoDBType = null;
};

Converter.prototype.serializeObject = null;
	
Converter.prototype.deserializeObject = null;

Converter.prototype.fromAttributeValue = function convertAttributeValueToObject(value) {
		if (value) {
			var innerValue = value[this.dynamoDBType];
			if (innerValue) {
				if (this.deserializeObject) {
					return this.deserializeObject(innerValue);
				}
				return innerValue;	
			}
		}
		return undefined;
	};
	
Converter.prototype.toAttributeValue = function convertObjectToAttributeValue(value) {
	if (this.isEmpty(value)) {
		return undefined;
	}
	var attributeValue = {};
	var innerValue;
	if (this.serializeObject) {
		innerValue = this.serializeObject(value);
	} else {
		innerValue = value;
	}
	attributeValue[this.dynamoDBType] = innerValue;
	return attributeValue;
};

Converter.prototype.toAttributeUpdate = function convertObjectToAttributeValue(value, action) {
	if (this.isEmpty(value)) {
		return undefined;
	}
	return {
		Action: action,
		Value: this.toAttributeValue(value)
	};
};

Converter.prototype.isEmpty = function isObjectEmpty(value) {
	return value === undefined;
};
	
Converter.prototype.isValid = function isObjectValid(value) {
	if (value) {
		return true;
	} else {
		return false;
	}
};

module.exports = Converter;