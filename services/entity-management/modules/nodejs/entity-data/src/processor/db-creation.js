//scrantonTable.js

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
console.log('entity-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV));
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: 'entity-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
    KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' }, //Partition key
        { AttributeName: 'SK', KeyType: 'RANGE' }, //sort key
        
    ],
    AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};

var paramsDelete = {
    TableName: 'entity-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
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

// var params = {
//     RequestItems: {
//         'entity-data-dev': [
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '12' },
//                         nsn_type: { S: 'group' },
//                         owa: { S: 'F' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1234' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1234' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1230' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1230' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1235' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1235' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12341122334455' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'D' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12341122334455' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12341223344556' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12341223344556' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232342323' + new Date().getTime() },
//                     },
//                 },
//             },

//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '1234323dd42323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1234323dd42323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '123432r2342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '123432r2342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '123432u2342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         nsn_update_date: { S: '123432u2342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343g32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343g32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343a32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343a32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343s32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343s32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343f32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343f32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343v32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343v32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343u32342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343u32342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12344232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12344232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12345232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12345232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12346232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12346232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12347232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12347232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12348232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12348232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12349232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12349232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12340232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12340232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343032342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343032342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343932342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343932342323' + new Date().getTime() },
//                     },
//                 },
//             },
//         ],
//     },
// };

// var params1 = {
//     RequestItems: {
//         'nsn-routing-dev': [
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343832342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343832342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343732342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343732342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343632342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343632342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343532342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343532342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343432342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343432342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343230342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343230342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343239342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343239342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343238342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343238342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343237342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343237342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343236342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343236342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343235342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343235342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343234342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343234342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343233342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343233342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232392323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232392323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232382323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232382323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232372323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232372323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232362323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232362323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232352323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232352323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232342323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232342323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232332323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232332323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '12343232322323' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '12343232322323' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1234' },
//                         routing_id: { S: '1234323231po23' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'N' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1234323231po23' + new Date().getTime() },
//                     },
//                 },
//             },

//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1244' },
//                         routing_id: { S: '1244223344556' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'P' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1244223344556' + new Date().getTime() },
//                     },
//                 },
//             },
//         ],
//     },
// };

// var params2 = {
//     RequestItems: {
//         'nsn-routing-dev': [
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1244' },
//                         routing_id: { S: '1244223344557' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'P' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1244223344557' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1244' },
//                         routing_id: { S: '1244223344558' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'P' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1244223344558' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '1244' },
//                         routing_id: { S: '1244223344559' },
//                         nsn_type: { S: 'nsn' },
//                         owa: { S: 'P' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1244223344559' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1222' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1222' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1211' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1211' + new Date().getTime() },
//                     },
//                 },
//             },

//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1212' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1212' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1213' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1213' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1214' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1214' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1215' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1215' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1216' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1216' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1217' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1217' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1218' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1218' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1219' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1219' + new Date().getTime() },
//                     },
//                 },
//             },
//             {
//                 PutRequest: {
//                     Item: {
//                         group_id: { N: '12' },
//                         routing_id: { S: '1220' },
//                         nsn_type: { S: 'class' },
//                         owa: { S: 'M' },
//                         update_date: { S: '' + new Date().getTime() },
//                         nsn_update_date: { S: '1220' + new Date().getTime() },
//                     },
//                 },
//             },
//         ],
//     },
// };

// dynamodb.batchWriteItem(params, function (err, data) {
//     if (err) {
//         console.log('Error', err);
//     } else {
//         console.log('Success', data);
//     }
// });

// dynamodb.batchWriteItem(params1, function (err, data) {
//     if (err) {
//         console.log('Error', err);
//     } else {
//         console.log('Success', data);
//     }
// });

// dynamodb.batchWriteItem(params2, function (err, data) {
//     if (err) {
//         console.log('Error', err);
//     } else {
//         console.log('Success', data);
//     }
// });
