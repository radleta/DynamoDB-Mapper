var Converter = require('./converter');

function MapConverter(mapper) {
	
	var self = new Converter();
	
	self.name = 'M';
	self.dynamoDBType = 'M';
	self.mapper = mapper;
	
	self.serializeObject = function serializeMap(value) {
		return self.mapper.toAttributeValues(value);
	};
		
	self.deserializeObject = function deserializeMap(value) {
		return self.mapper.fromAttributeValues(value);
	};
	
	self.isValid = function isObjectValid(value) {
		return true;
	};
	
	return self;
	
}

module.exports = MapConverter;