var Converter = require('./converter');

function MapConverter(mapper) {
	this.name = 'M';
	this.dynamoDBType = 'M';
	this.mapper = mapper;
}

MapConverter.prototype = new Converter();

MapConverter.prototype.serializeObject = function serializeMap(value) {
	return this.mapper.toAttributeValues(value);
};
	
MapConverter.prototype.deserializeObject = function deserializeMap(value) {
	return this.mapper.fromAttributeValues(value);
};

MapConverter.prototype.isEmpty = function isObjectEmpty(value) {
	return value === undefined;
};
	
MapConverter.prototype.isValid = function isObjectValid(value) {
	return true;
};

exports = module.exports = MapConverter;