var Converter = require('./converter');

function ListConverter(itemConverter) {
	var self = new Converter();
	var base = {};
	
	self.name = 'L';
	self.dynamoDBType = 'L';
	self.itemConverter = itemConverter;
	
	self.serializeObject = function serializeList(value) {
		if (value===null) {
			return null;
		}
		var attributeValues = [];
		for (var i = 0; i < value.length; i++) {
			attributeValues.push(self.itemConverter.toAttributeValue(value[i]));
		}
		return attributeValues;
	};
	
	self.deserializeObject = function deserializeList(value) {
		if (value===null) {
			return null;
		}
		var items = [];
		for (var i = 0; i < value.length; i++) {
			items.push(self.itemConverter.fromAttributeValue(value[i]));
		}
		return items;
	};
	
	self.isValid = function isListValid(value) {
		return true;
	};

	// remember the base implementation
	base.toAttributeUpdate = self.toAttributeUpdate.bind(self);

	// override the implementation
	self.toAttributeUpdate = function convertObjectToAttributeValue(value) {
		if (value === undefined) {
			return undefined;
		} else if (value.length === 0) {
			return { Action: 'DELETE' };
		}
		return base.toAttributeUpdate(value);
	};
	
	return self;
}

module.exports = ListConverter;