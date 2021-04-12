//scrantonTable.js

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
console.log('nsn-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV));
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: 'nsn-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
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
    TableName: 'nsn-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
};


dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error('Error JSON.', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table.', JSON.stringify(data, null, 2));
    }
});


var params = {
    RequestItems: {
        'nsn-data-dev': [
            {
                PutRequest: {
                    Item: {
                        PK: { S: '000000105' },
                        SK: { S: 'nif_details' },
                        details: { S: '{"d403_acq_ad": "J","d403_byr_cd": "TT","d403_cont_off": "A","d403_d_o_rating": "N","d403_dac": "","d403_dt_chged": "2003234","d403_dt_last_pur": "","d403_dt_loaded": "2003234","d403_dt_reset": "2011273","d403_est_prc": 1,"d403_fy_po": null,"d403_fy_po_qty": null,"d403_fy_reqn": null,"d403_fy_reqn_qty": null,"d403_item_ind": "1","d403_mgr_cd": "","d403_mop_cd": "21","d403_nsn_5": "0","d403_nsn_6_15": "00000105","d403_phrase_cd": "","d403_proj_cd_pr": "","d403_proper_name": "","d403_psc_cd": "0000","d403_psm_qty": 0,"d403_sched_no": "","d403_source_info_1": null,"d403_source_info_10": null,"d403_source_info_11": null,"d403_source_info_12": null,"d403_source_info_2": null,"d403_source_info_3": null,"d403_source_info_4": null,"d403_source_info_5": null,"d403_source_info_6": null,"d403_source_info_7": null,"d403_source_info_8": null,"d403_source_info_9": null,"d403_spec_no": "","d403_stk_nstk_ind": "N","d403_sub_nsn": "","d403_type_id_cd": "","d403_ui": "EA","d403_uii": "","d403_un_id": "","d403_ut_cube": 1,"d403_ut_wgt": 1,"d403_vendor_partno": ""}' },
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