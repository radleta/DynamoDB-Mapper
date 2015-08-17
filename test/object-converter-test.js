var ObjectConverter = require('../lib/object-converter');
var converter = new ObjectConverter();
var assert = require('chai').assert;

describe('ObjectConverter', function () {
	
	describe('serializeObject', function() {
	    it('successfully serialize object to JSON string', function () {
	    	var expected = {
	    		a: 123,
	    		b: 'abc'
	    	};
	    	assert.equal(JSON.stringify(expected), converter.serializeObject(expected))
	    });
	    it('successfully serialize object to JSON string of null', function () {
	    	var expected = null;
	    	assert.equal(JSON.stringify(expected), converter.serializeObject(expected));
	    });
	});
	
	describe('deserializeObject', function() {
	    it('successfully deserialize valid JSON string', function () {
	    	var expected = {
	    		a: 123,
	    		b: 'abc'
	    	};
	    	var actual = converter.deserializeObject(JSON.stringify(expected));
	    	assert.typeOf(actual, 'object', 'expected a type of object');
	    	assert.equal(JSON.stringify(expected), JSON.stringify(actual));
	    });
	    
	    it('successfully deserialize valid JSON string of null', function () {
	    	var expected = null;
	    	var actual = converter.deserializeObject(JSON.stringify(expected));
	    	assert.equal(JSON.stringify(expected), JSON.stringify(actual))
	    });
	});
	
});