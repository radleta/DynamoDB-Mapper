var StringConverter = require('./string-converter');
var StringSetConverter = require('./string-set-converter');
var NumberConverter = require('./number-converter');
var DateConverter = require('./date-converter');
var ObjectConverter = require('./object-converter');

// build hashset of the converters
var converters = {
	// export the converters
	string: new StringConverter(),
	stringSet: new StringSetConverter(),
	number: new NumberConverter(),
	date: new DateConverter(),
	object: new ObjectConverter(),
};

// export the converters by type
converters.byType = {
	S: converters.string,
	SS: converters.stringSet,
	N: converters.number,
	D: converters.date,
	O: converters.object,
};

module.exports = converters;