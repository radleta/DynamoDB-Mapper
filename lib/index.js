// include our types
var Mapper = require('./mapper');

// include our instances
var converters = require('./converters');

/** The entry point for the whole library. Exposes all the relevant functions and constructors. */
function DynamoDBMapper() {
	var self = {};

	self.Mapper = Mapper;
	self.converters = converters;
	
	return self;
}

// singleton; we don't want two of these exported
module.exports = new DynamoDBMapper();