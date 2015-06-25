var Converter = require('./converter');

function ListConverter(itemConverter) {
	var self = new Converter();
	
	self.name = 'L';
	self.dynamoDBType = 'L';
	self.itemConverter = itemConverter;
	
	self.serializeObject = function serializeList(value) {
		var attributeValues = [];
		for (var i = 0; i < value.length; i++) {
			attributeValues.push(this.itemConverter.toAttributeValue(value[i]));
		}
		return attributeValues;
	};
	
	self.deserializeObject = function deserializeList(value) {
		var items = [];
		for (var i = 0; i < value.length; i++) {
			items.push(this.itemConverter.fromAttributeValue(value[i]));
		}
		return items;
	};
	
	self.isEmpty = function isListEmpty(value) {
		return value === undefined || value === null || value.length === 0;
	};
	
	self.isValid = function isListValid(value) {
		return true;
	};
	
	return self;
}

exports = module.exports = ListConverter;