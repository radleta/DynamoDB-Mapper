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
    dateAsNull: { type: 'D' },
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
    dateAsNull: null,
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
    dateAsNull: { NULL: true },
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
    india: {
        Action: "PUT",
        Value: {
            L: [
                {
                    M: {
                        a: {
                            N: "123"
                        },
                        b: {
                            S: "abc"
                        },
                        c: {
                            M: {
                                d: {
                                    N: "456"
                                },
                                e: {
                                    S: "def"
                                }
                            }
                        }
                    }
                },
                {
                    M: {
                        a: {
                            N: "123"
                        },
                        b: {
                            S: "abc"
                        },
                        c: {
                            M: {
                                d: {
                                    N: "456"
                                },
                                e: {
                                    S: "def"
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    juliet: { Action: 'PUT', Value: { SS: expectedItem.juliet } },
    dateAsNull: { Action: 'PUT', Value: { NULL: true } },
  };
  var expectedPutRequest = {
    PutRequest: {
      Item: expectedAttributeValues
    }
  };
  var expectedDeleteRequest = {
    DeleteRequest: {
      Key: expectedKey
    }
  };

  describe('fromAttributeValues', function () {
    it('returns falsey when falsey data', function () {
      assert(!mapper.fromAttributeValues(null));
    });
    it('successfully maps all expected values', function () {
      var actual = mapper.fromAttributeValues(expectedAttributeValues);
      assert.deepEqual(actual, expectedItem);
    });
  });

  describe('toAttributeValues', function () {
    it('returns empty when falsey data', function () {
      assert(!mapper.toAttributeValues(null));
    });
    it('successfully maps all expected values', function () {
      var actual = mapper.toAttributeValues(expectedItem);
      assert.deepEqual(actual, expectedAttributeValues);
    });
  });

  describe('toAttributeUpdates', function () {
    it('returns empty when falsey data', function () {
      assert(!mapper.toAttributeUpdates(null));
    });
    it('successfully maps all expected values', function () {
      var actual = mapper.toAttributeUpdates(expectedItem);
      //console.log(JSON.stringify(actual, null, 4));
      assert.deepEqual(actual, expectedAttributeUpdates);
    });
  });

  describe('toKey', function () {
    it('returns empty when falsey data', function () {
      assert.isObject(mapper.toKey(null));
    });
    it('successfully maps all expected values', function () {
      var actual = mapper.toKey(expectedItem);
      assert.deepEqual(actual, expectedKey);
    });
  });
  
  describe('toPutRequests', function () {
    it('returns empty when null', function () {
      assert(mapper.toPutRequests(null).length===0);
    });
    it('returns empty when null', function () {
      assert(mapper.toPutRequests([]).length===0);
    });
    it('returns empty when falsey', function () {
      assert(mapper.toPutRequests(false).length===0);
    });
    it('successfully maps all expected values without preMap or postMap', function () {
      var actual = mapper.toPutRequests([expectedItem, expectedItem, expectedItem]);
      assert.deepEqual(actual, [expectedPutRequest, expectedPutRequest, expectedPutRequest]);
    });
    it('successfully maps all expected values with preMap or postMap', function () {
      var inputItems = [expectedItem, expectedItem, expectedItem];
      var expectedAttributeValues = [expectedPutRequest, expectedPutRequest, expectedPutRequest];
      var preMapItems = [];
      var postMapItems = [];
      var postMapAttributeValues = [];
      var actual = mapper.toPutRequests(inputItems, function (item) {   
        preMapItems.push(item);
        return item;
      }, function (item, itemAttributeValues) {
        postMapItems.push(item);
        postMapAttributeValues.push({
          PutRequest: {
            Item: itemAttributeValues
          }
        });
        return itemAttributeValues;
      });
      assert.deepEqual(actual, expectedAttributeValues);
      assert.deepEqual(preMapItems, inputItems);
      assert.deepEqual(postMapItems, inputItems);
      assert.deepEqual(postMapAttributeValues, expectedAttributeValues);
    });
  });
  
  describe('toDeleteRequests', function () {
    it('returns empty when null', function () {
      assert(mapper.toDeleteRequests(null).length===0);
    });
    it('returns empty when null', function () {
      assert(mapper.toDeleteRequests([]).length===0);
    });
    it('returns empty when falsey', function () {
      assert(mapper.toDeleteRequests(false).length===0);
    });
    it('successfully maps all expected values without preMap or postMap', function () {
      var actual = mapper.toDeleteRequests([expectedItem, expectedItem, expectedItem]);
      assert.deepEqual(actual, [expectedDeleteRequest, expectedDeleteRequest, expectedDeleteRequest]);
    });
    it('successfully maps all expected values with preMap or postMap', function () {
      var inputItems = [expectedItem, expectedItem, expectedItem];
      var expectedAttributeValues = [expectedDeleteRequest, expectedDeleteRequest, expectedDeleteRequest];
      var preMapItems = [];
      var postMapItems = [];
      var postMapAttributeValues = [];
      var actual = mapper.toDeleteRequests(inputItems, function (item) {   
        preMapItems.push(item);
        return item;
      }, function (item, itemKey) {
        postMapItems.push(item);
        postMapAttributeValues.push({
          DeleteRequest: {
            Key: itemKey
          }
        });
        return itemKey;
      });
      assert.deepEqual(actual, expectedAttributeValues);
      assert.deepEqual(preMapItems, inputItems);
      assert.deepEqual(postMapItems, inputItems);
      assert.deepEqual(postMapAttributeValues, expectedAttributeValues);
    });
  });
  
});
