//scrantonTable.js

const AWS = require('aws-sdk');
const dotenv = require('dotenv');

console.log('nsn-routing-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV));

dotenv.config();

/*
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: 'nsn-routing-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
    KeySchema: [
        { AttributeName: 'group_id', KeyType: 'HASH' }, //Partition key
        { AttributeName: 'routing_id', KeyType: 'RANGE' }, //sort key
    ],
    AttributeDefinitions: [
        { AttributeName: 'group_id', AttributeType: 'N' },
        { AttributeName: 'routing_id', AttributeType: 'S' },
        { AttributeName: 'nsn_owa', AttributeType: 'S' },
    ],
    LocalSecondaryIndexes: [
        {
            IndexName: 'RoutingOWAIndex',
            KeySchema: [
                { AttributeName: 'group_id', KeyType: 'HASH' },
                { AttributeName: 'nsn_owa', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};

var paramsDelete = {
    TableName: 'nsn-routing-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
};
// dynamodb.deleteTable(paramsDelete, function(err, data) {
//     if (err) {
//         console.error("Error JSON.", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table.", JSON.stringify(data, null, 2));
//     }
// });

dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error('Error JSON.', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table.', JSON.stringify(data, null, 2));
    }
});
*/
