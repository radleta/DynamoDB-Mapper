# DynamoDB-Mapper

A fast, easy to use Amazon DynamoDB to Javascript Object mapper.

## Installation

```bash
$ npm install dynamodb-mapper
```

## Features

* Agnostic to Amazon client
* Focus on high performance
* Test coverage
* Explicit mapping definition to prevent data leaks

## Data Types

| Data Type | Amazon Type | DynamoDB-Mapper Type | Supported | Serialization | 
| --------- | ----------- | -------------------- | --------- | ------------- |
| String    | S           | S                    | Yes       | Native        |
| Date      | S           | D                    | Yes       | ISO String    |
| Number    | N           | N                    | Yes       | Native        |
| Map       | M           | M                    | Yes       | Native        |
| List      | L           | L                    | Yes       | Native        |
| Object    | S           | O                    | Yes       | JSON String   |
| String Set | SS         | SS                   | Yes       | Native        |
| Number Set | NS         | n/a                  | No        | n/a           |
| Binary     | B          | n/a                  | No        | n/a           |
| Binary Set | BS         | n/a                  | No        | n/a           |
| Boolean    | BOOL       | n/a                  | No        | n/a           |
| NULL       | NULL       | n/a                  | No        | n/a           |

AWS SDK Data Type Documentation:

* [Data Model](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DataModel.html)
* [AttributeValue](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html)

## Getting Started

```js
var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var dynamodb = new aws.DynamoDB();
var dynamodbMapper = require('dynamodb-mapper');

// build your map
var myMap = {
    myStringHashKey: { type: 'S', hashKey: true },
    myDateRangeKey: { type: 'D', rangeKey: true },
    myString: { type: 'S' },
    myDate: { type: 'D' },
    myNumber: { type: 'N' },
    myMap: { 
        type: 'M', 
        map: {
            myMapString: { type: 'S' },
            myMapDate: { type: 'D' },
            /* ... */
        },
    },
    myJsonAsString: { type: 'O' },
    myListOfNumbers: {
        type: 'L',
        valueMap: { type: 'N' },
    },
    myListOfMaps: {
        type: 'L',
        valueMap: { 
            type: 'M', 
            map: {
                myMapString: { type: 'S' },
                myMapDate: { type: 'D' },
                /* ... */
            },
        },
    },
    myStringSet: { type: 'SS' },
};

// create your mapper
// NOTE: you should do it once and reuse it
var myMapper = new dynamodbMapper.Mapper(myMap);

// create my test data
var myData = {
    myStringHashKey: 'my-hash-key-goes-here',
    myDateRangeKey: new Date(),
    myString: 'my-string-here',
    myDate: new Date(),
    myNumber: 1234,
    myMap: {
        myMapString: 'my-map-string-here',
        myMapDate: new Date(),
    },
    myJsonAsString: {
        value1: 'first value',
        value2: new Date(),
    },
    myListOfNumbers: [
        1234,
        5678,
        9012,
    ],
    myListOfMaps: [
        {
            myMapString: 'my-map-string-here-1',
            myMapDate: new Date(),
        },
        {
            myMapString: 'my-map-string-here-2',
            myMapDate: new Date(),
        },
    ],
    myStringSet: [
        'abc',
        'def',
    ],
};

// convert javascript object to attribute updates
var attributeUpdates = myMapper.toAttributeUpdates(myData);

// get the key (hash and range)
var key = myMapper.toKey(myData);

// send the updates to dynamodb
dynamodb.updateItem({
    Key: key,
    TableName: 'mydynamodbtablename',
    AttributeUpdates: attributeUpdates,
}, function (updateErr, updateData) {

    if (updateErr) {
        // do something dramatic because we errored
        throw updateErr;
    }
    
    // let's fetch our data
    return dynamodb.getItem({
        Key: key,
        TableName: 'mydynamodbtablename',
    }, function (getErr, getData) {
        if (getErr) {
            // do something dramatic because we errored
            throw updateErr;
        }
        
        // convert the DynamoDB item to Javascript Object
        var myDataFromAws = myMapper.fromAttributeValues(getData.Item);
        
        // we now have the data converted from attribute values back in javascript object format
    });
    
});

```