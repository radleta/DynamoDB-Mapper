var MapConverter = require('./map-converter');
var ListConverter = require('./list-converter');
var converters = require('./converters');

// fn to get a converter
function getConverter(valueMap) {
	if (!valueMap) {
		throw new Error('No value map provided.');
	} else if (!valueMap.type) {
		throw new Error('Invalid value map. No type defined.');	
	}
	switch (valueMap.type) {
		case 'M':
			if (!valueMap.map) {
				throw new Error('Invalid value map. No map defined. Type of M requires a map to be defined.');
			}
			return new MapConverter(new Mapper(valueMap.map));
		case 'L':
			if (!valueMap.valueMap) {
				throw new Error('Invalid value map. No valueMap defined. Type of L requires a valueMap to be defined.');
			}
			return new ListConverter(getConverter(valueMap.valueMap));
	}
	var converter = converters.byType[valueMap.type];
	if (!converter) {
		throw new Error('Invalid value map. The type ' + valueMap.type + ' has not been implemented.');	
	}
	return converter;
}

function Mapper(map) {
	
	// compile the map
	if (!map) {
		throw new Error("No map provided. The map is required.");
	} else if (Object.keys(map).length===0) {
		throw new Error("Empty map. The map cannot be empty.");
	}
	
	var self = {};
	
	// the compiled map
	self.compiledMap = {};
	
	// iterate over the map and create the compiled version
	for (var name in map) {
		var attributeValueMap = map[name];
		
		// get the converter
		var converter;
		try
		{
			converter = getConverter(attributeValueMap);
		}
		catch (ex)
		{
			throw new Error('The ' + name + ' property caused an error. ' + ex.message);
		}
		
		self.compiledMap[name] = {
			converter: converter,
			type: attributeValueMap.type,
			hashKey: attributeValueMap.hashKey,
			rangeKey: attributeValueMap.rangeKey,
		};
	}
	
	// fn to create an Object from the AttributeValues
	self.fromAttributeValues = function (attributeValues) {
		
		if (!attributeValues) {
			// IF we get no item
			// THEN we can safely return nothing
			return null;
		}
		
		// map the item to our new data
		var data = {};
		for (var name in self.compiledMap) {
			// perform the map
			var attributeValue = attributeValues[name];
			if (attributeValue !== undefined) {
				data[name] = self.compiledMap[name].converter.fromAttributeValue(attributeValue);
			}
		}
		
		return data;
	};
	
	// fn to create AttributeValues from an Object
	self.toAttributeValues = function (item) {
		
		// always create the item regardless of whether data exists
		var attributeValues = {};
		
		// always return empty item when none is passed
		if (!item) {
			return null;
		}
		
		// map the attribute updates from the incoming data
		for (var name in item) {
			var attributeValueMap = self.compiledMap[name];
			if (attributeValueMap) {
				var attributeValue = attributeValueMap.converter.toAttributeValue(item[name]);
				if (attributeValue !== undefined) {
					attributeValues[name] = attributeValueMap.converter.toAttributeValue(item[name]);
				}
			}
		}
		
		// only return a valid Object when their are Updates to be made
		if (Object.keys(attributeValues).length > 0) {
			return attributeValues;
		} else {
			return null;
		}
		
	};
	
	// fn to create AttributeUpdates from an Object
	self.toAttributeUpdates = function (item) {
		
		// always create the item regardless of whether data exists
		var attributeUpdates = {};
		
		// always return empty item when none is passed
		if (!item) {
			return null;
		}
		
		// map the attribute updates from the incoming data
		for (var name in item) {
			var attributeValueMap = self.compiledMap[name];
			if (attributeValueMap && !attributeValueMap.hashKey && !attributeValueMap.rangeKey) {
				var attributeUpdate = attributeValueMap.converter.toAttributeUpdate(item[name]);
				if (attributeUpdate !== undefined) {
					attributeUpdates[name] = attributeUpdate;
				}
			}
		}
		
		// return the updates will be empty if only hash and range keys provided
		return attributeUpdates;
	};
	
	/** Maps an item to a key. Only the hash and range key will return as attribute values. */
	self.toKey = function (item) {
		// always create the item regardless of whether data exists
		var key = {};
		
		// always return empty item when none is passed
		if (!item) {
			return key;
		}
		
		// map the item to the key
		for (var name in item) {
			var attributeValueMap = self.compiledMap[name];
			if (attributeValueMap && (attributeValueMap.hashKey || attributeValueMap.rangeKey)) {
				var attributeValue = attributeValueMap.converter.toAttributeValue(item[name]);
				if (attributeValue !== undefined) {
					key[name] = attributeValue;
				}
			}
		}
		
		return key;
	};

	/** Converts an array of items to an array of PutRequests to use with batchWriteItem operation. */
	self.toPutRequests = function (putItems, preMap, postMap) {
		// build the putRequests
		var putRequests = [];
		
		// process the put
		if (putItems && putItems.length > 0) {
			for (var i = 0; i < putItems.length; i++) {
				var putItem = putItems[i];
				if (preMap) {
					putItem = preMap(putItem);
				}
				var attributeValues = self.toAttributeValues(putItem);
				if (postMap) {
					attributeValues = postMap(putItem, attributeValues);
				}
				var putRequest = {
					PutRequest: {
						Item: attributeValues
					},
				};
				putRequests.push(putRequest);
			}
		}
		
		// return the put requests
		return putRequests;
	};
	
	/** Converts an array of items to an array of DeleteRequests to use with batchWriteItem operation. */
	self.toDeleteRequests = function (deleteItems, preMap, postMap) {
		// build the deleteRequests
		var deleteRequests = [];
		
		// process the delete
		if (deleteItems && deleteItems.length > 0) {
			for (var i = 0; i < deleteItems.length; i++) {
				var deleteItem = deleteItems[i];
				if (preMap) {
					deleteItem = preMap(deleteItem);
				}
				var key = self.toKey(deleteItem);
				if (postMap) {
					key = postMap(deleteItem, key);
				}
				var deleteRequest = {
					DeleteRequest: {
						Key: key
					},
				};
				deleteRequests.push(deleteRequest);
			}
		}
		
		// return the put requests
		return deleteRequests;
	};
	
	return self;

}

module.exports = Mapper;