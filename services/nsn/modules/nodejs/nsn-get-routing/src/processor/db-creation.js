//scrantonTable.js
const AWS = require("aws-sdk");
AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "nsn_data",
    KeySchema: [
        { AttributeName: "group_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "routing_id", KeyType: "RANGE"},  //sort key
],
    AttributeDefinitions: [
        { AttributeName: "group_id", AttributeType: "N"  },
        { AttributeName: "routing_id", AttributeType: "S"  },
],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

var paramsDelete = {
    TableName : "nsn_data"
};
// dynamodb.deleteTable(paramsDelete, function(err, data) {
//     if (err) {
//         console.error("Error JSON.", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table.", JSON.stringify(data, null, 2));
//     }
// });

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Error JSON.", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table.", JSON.stringify(data, null, 2));
    }
});