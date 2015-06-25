var Mapper = require('../lib/mapper');
var assert = require('chai').assert;

describe('Mapper', function () {

  it('throws error when no map provided', function () {
    assert.throws(function () {
      new Mapper(null);
    }, 'No map provided. The map is required.');
  });
  it('throws error when map is empty', function () {
    assert.throws(function () {
      new Mapper({});
    }, 'Empty map. The map cannot be empty.');
  });
  it('throws error when invalid map provided', function () {
    assert.throws(function () {
      new Mapper({
        id: {}
      });
    }, 'The id property caused an error. Invalid value map. No type defined.');
  });

  var map = {
    id: { type: 'S', hashKey: true },
    range: { type: 'S', rangeKey: true },
    alpha: { type: 'S' },
    beta: { type: 'N' },
    //charlie: { type: 'B' },
    //delta: { type: 'SS' },
    //echo: { type: 'NS' },
    //foxtrot: { type: 'BS' }
    golf: { type: 'D' },
    hotel: { type: 'O' },
    india: {
      type: 'L',
      valueMap: {
  			type: 'M',
  			map: {
  				a: { type: 'N' },
  				b: { type: 'S' },
  				c: {
  					type: 'M',
  					map: {
  						d: { type: 'N' },
  						e: { type: 'S' },
  					}
  				}
  			},
  		}
    },
    juliet: { type: 'SS' },
  };
  var mapper = new Mapper(map);

  var dateValue = new Date();
  var expectedItem = {
    id: '999',
    range: '511abc',
    alpha: 'abc',
    beta: 123,
    //charlie: 'binary+data',
    //delta: ['def', 'ghi'],
    //echo: [456, 789],
    //foxtrot: ['bin1', 'bin2']
    golf: dateValue,
    hotel: { a: 123, b: 'abc' },
    india: [
  		{
  			a: 123,
  			b: 'abc',
  			c: {
  				d: 456,
  				e: 'def'
  			}
  		},
  		{
  			a: 123,
  			b: 'abc',
  			c: {
  				d: 456,
  				e: 'def',
  			}
  		}
  	],
    juliet: [
      'abc123',
      'def456',
    ],
  };
  var expectedKey = {
    id: { S: '999' },
    range: { S: '511abc' },
  };
  var expectedAttributeValues = {
    id: { S: '999' },
    range: { S: '511abc' },
    alpha: { S: 'abc' },
    beta: { N: '123' },
    //charlie: { B: 'binary+data' },
    //delta: { SS: ['def', 'ghi'] },
    //echo: { NS: [456, 789] },
    //foxtrot: { BS: ['bin1', 'bin2'] }
    golf: { S: dateValue.toISOString() },
    hotel: { S: '{"a":123,"b":"abc"}' },
    india: {
      L: [
    		{
    			M: {
    				a: { N: '123' },
    				b: { S: 'abc' },
    				c: {
    					M: {
    						d: { N: '456' },
    						e: { S: 'def' }
    					}
    				}
    			}
    		},
    		{
    			M: {
    				a: { N: '123' },
    				b: { S: 'abc' },
    				c: {
    					M: {
    						d: { N: '456' },
    						e: { S: 'def' }
    					}
    				}
    			}
    		}
    	]
    },
    juliet: {
      SS: [
        'abc123',
        'def456',
      ]
    },
  };
  var expectedAttributeUpdates = {
    alpha: { Action: 'PUT', Value: { S: 'abc' } },
    beta: { Action: 'PUT', Value: { N: '123' } },
    //charlie: { B: 'binary+data' },
    //delta: { SS: ['def', 'ghi'] },
    //echo: { NS: [456, 789] },
    //foxtrot: { BS: ['bin1', 'bin2'] }
    golf: { Action: 'PUT', Value: { S: dateValue.toISOString() } },
    hotel: { Action: 'PUT', Value: { S: JSON.stringify(expectedItem.hotel) } },
    juliet: { Action: 'PUT', Value: { SS: expectedItem.juliet } },
  };

  // describe('fromAttributeValues', function () {
  //   it('returns falsey when falsey data', function () {
  //     assert(!mapper.fromAttributeValues(null));
  //   });
  //   it('successfully maps all expected values', function () {
  //     var actual = mapper.fromAttributeValues(expectedAttributeValues);
  //     assert.deepEqual(actual, expectedItem);
  //   });
  // });

  describe('toAttributeValues', function () {
    it('returns empty when falsey data', function () {
      assert(!mapper.toAttributeValues(null));
    });
    it('successfully maps all expected values', function () {
      var dateValue = new Date();
      var actual = mapper.toAttributeValues(expectedItem);
      assert.deepEqual(actual, expectedAttributeValues);
    });
  });

  // describe('toAttributeUpdates', function () {
  //   it('returns empty when falsey data', function () {
  //     assert(!mapper.toAttributeUpdates(null));
  //   });
  //   it('successfully maps all expected values', function () {
  //     var actual = mapper.toAttributeUpdates(expectedItem);
  //     assert.deepEqual(actual, expectedAttributeUpdates);
  //   });
  // });

  describe('toKey', function () {
    it('returns empty when falsey data', function () {
      assert.isObject(mapper.toKey(null));
    });
    it('successfully maps all expected values', function () {
      var actual = mapper.toKey(expectedItem);
      assert.deepEqual(actual, expectedKey);
    });
  });
  
});
