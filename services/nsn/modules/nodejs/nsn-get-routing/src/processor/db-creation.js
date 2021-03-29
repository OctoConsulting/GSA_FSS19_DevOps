//scrantonTable.js

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
console.log('nsn-routing-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV));
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

var params = {
    RequestItems: {
        'nsn-routing-dev': [
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '12' },
                        type: { S: 'group' },
                        owa: { S: 'F' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1234' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1230' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1235' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12341122334455' },
                        type: { S: 'nsn' },
                        owa: { S: 'D' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12341223344556' },
                        type: { S: 'nsn' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },

            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1234323dd42323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#123432r2342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#123432u2342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343g32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343a32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343s32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343f32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343v32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343u32342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12344232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12345232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12346232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12347232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12348232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12349232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12340232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343032342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343932342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
        ],
    },
};

var params1 = {
    RequestItems: {
        'nsn-routing-dev': [
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343832342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343732342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343632342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343532342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343432342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343230342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343239342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343238342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343237342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343236342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343235342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343234342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343233342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232392323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232382323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232372323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232362323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232352323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232342323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232332323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#12343232322323' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1234323231po23' },
                        type: { S: 'nsn' },
                        owa: { S: 'N' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },

            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1244223344556' },
                        type: { S: 'nsn' },
                        owa: { S: 'P' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
        ],
    },
};

var params2 = {
    RequestItems: {
        'nsn-routing-dev': [
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1244223344557' },
                        type: { S: 'nsn' },
                        owa: { S: 'P' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1244223344558' },
                        type: { S: 'nsn' },
                        owa: { S: 'P' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '#1244223344559' },
                        type: { S: 'nsn' },
                        owa: { S: 'P' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1222' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1211' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },

            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1212' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1213' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1214' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1215' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1216' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1217' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1218' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1219' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        group_id: { N: '12' },
                        routing_id: { S: '1220' },
                        type: { S: 'class' },
                        owa: { S: 'M' },
                        update_date: { S: '' + new Date().getTime() },
                    },
                },
            },
        ],
    },
};

dynamodb.batchWriteItem(params, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data);
    }
});

dynamodb.batchWriteItem(params1, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data);
    }
});

dynamodb.batchWriteItem(params2, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data);
    }
});
