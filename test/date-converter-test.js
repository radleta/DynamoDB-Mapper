var DateConverter = require('../lib/date-converter');
var converter = new DateConverter();
var assert = require('chai').assert;

describe('DateConverter', function () {
	
	describe('serializeObject', function() {
	    it('successfully serialize date to ISO string', function () {
	    	var expected = new Date();
	    	assert.equal(expected.toISOString(), converter.serializeObject(expected))
	    });
	});
	
	describe('deserializeObject', function() {
	    it('successfully deserialize valid ISO date', function () {
	    	var expected = new Date();
	    	var actual = converter.deserializeObject(expected.toISOString());
	    	assert.typeOf(actual, 'date', 'expected a type of date');
	    	assert.equal(expected.toISOString(), actual.toISOString())
	    });
	});
	
});