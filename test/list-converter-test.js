var ListConverter = require('../lib/list-converter');
var StringConverter = require('../lib/string-converter');
var converter = new ListConverter(new StringConverter());
var assert = require('chai').assert;

describe('ListConverter', function () {
	
	describe('serializeObject', function() {
	    it('successfully serialize list', function () {
	    	var expected = [
 					{ S: 'abc' }, 
 					{ S: 'def' }
	    	];
	    	var input = [
	    		'abc',
	    		'def',
	    	];
	    	assert.deepEqual(expected, converter.serializeObject(input));
	    });
	    it('successfully serialize empty list', function () {
	    	var expected = [
	    	];
	    	var input = [
	    	];
	    	assert.deepEqual(expected, converter.serializeObject(input));
	    });
	    it('successfully serialize list to null', function () {
	    	var expected = null;
	    	var input = null;
	    	assert.deepEqual(expected, converter.serializeObject(input));
	    });
	});
	
	describe('deserializeObject', function() {
	    it('successfully deserialize', function () {
	    	var input = [
 					{ S: 'abc' }, 
 					{ S: 'def' }
	    	];
	    	var expected = [
	    		'abc',
	    		'def',
	    	];
	    	var actual = converter.deserializeObject(input);
	    	assert.typeOf(actual, 'array', 'expected a type of array');
	    	assert.deepEqual(expected, actual);
	    });
	    
	    it('successfully deserialize of null', function () {
	    	var expected = null;
	    	var actual = converter.deserializeObject(expected);
	    	assert.deepEqual(expected, actual);
	    });
	});
	
});