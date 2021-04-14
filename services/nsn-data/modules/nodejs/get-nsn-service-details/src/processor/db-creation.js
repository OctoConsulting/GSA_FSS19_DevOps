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
        { AttributeName: 'pk', KeyType: 'HASH' }, //Partition key
        { AttributeName: 'sk', KeyType: 'RANGE' }, //sort key
        
    ],
    AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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


var params1 = {
    RequestItems: {
        'nsn-data-dev': [
            {
                PutRequest: {
                    Item: {
                        "details": {
                          "M": {
                            "d403_acq_ad": {
                              "S": "J"
                            },
                            "d403_byr_cd": {
                              "S": "TT"
                            },
                            "d403_cont_off": {
                              "S": "A"
                            },
                            "d403_d_o_rating": {
                              "S": "N"
                            },
                            "d403_dac": {
                              "S": ""
                            },
                            "d403_dt_chged": {
                              "S": "2003234"
                            },
                            "d403_dt_last_pur": {
                              "S": ""
                            },
                            "d403_dt_loaded": {
                              "S": "2003234"
                            },
                            "d403_dt_reset": {
                              "S": "2011273"
                            },
                            "d403_est_prc": {
                              "N": "1"
                            },
                            "d403_fy_po": {
                              "NULL": true
                            },
                            "d403_fy_po_qty": {
                              "NULL": true
                            },
                            "d403_fy_reqn": {
                              "NULL": true
                            },
                            "d403_fy_reqn_qty": {
                              "NULL": true
                            },
                            "d403_item_ind": {
                              "S": "1"
                            },
                            "d403_mgr_cd": {
                              "S": ""
                            },
                            "d403_mop_cd": {
                              "S": "21"
                            },
                            "d403_nsn_5": {
                              "S": "0"
                            },
                            "d403_nsn_6_15": {
                              "S": "00000105"
                            },
                            "d403_phrase_cd": {
                              "S": ""
                            },
                            "d403_proj_cd_pr": {
                              "S": ""
                            },
                            "d403_proper_name": {
                              "S": ""
                            },
                            "d403_psc_cd": {
                              "S": "0000"
                            },
                            "d403_psm_qty": {
                              "N": "0"
                            },
                            "d403_sched_no": {
                              "S": ""
                            },
                            "d403_source_info_1": {
                              "NULL": true
                            },
                            "d403_source_info_10": {
                              "NULL": true
                            },
                            "d403_source_info_11": {
                              "NULL": true
                            },
                            "d403_source_info_12": {
                              "NULL": true
                            },
                            "d403_source_info_2": {
                              "NULL": true
                            },
                            "d403_source_info_3": {
                              "NULL": true
                            },
                            "d403_source_info_4": {
                              "NULL": true
                            },
                            "d403_source_info_5": {
                              "NULL": true
                            },
                            "d403_source_info_6": {
                              "NULL": true
                            },
                            "d403_source_info_7": {
                              "NULL": true
                            },
                            "d403_source_info_8": {
                              "NULL": true
                            },
                            "d403_source_info_9": {
                              "NULL": true
                            },
                            "d403_spec_no": {
                              "S": ""
                            },
                            "d403_stk_nstk_ind": {
                              "S": "N"
                            },
                            "d403_sub_nsn": {
                              "S": ""
                            },
                            "d403_type_id_cd": {
                              "S": ""
                            },
                            "d403_ui": {
                              "S": "EA"
                            },
                            "d403_uii": {
                              "S": ""
                            },
                            "d403_un_id": {
                              "S": ""
                            },
                            "d403_ut_cube": {
                              "N": "1"
                            },
                            "d403_ut_wgt": {
                              "N": "1"
                            },
                            "d403_vendor_partno": {
                              "S": ""
                            }
                          }
                        },
                        "pk": {
                          "S": "000000105"
                        },
                        "sk": {
                          "S": "nif_details"
                        }
                      },


                      Item: {
                        "details": {
                          "M": {
                            "d403_acq_ad": {
                              "S": "J"
                            },
                            "d403_byr_cd": {
                              "S": "E6"
                            },
                            "d403_cont_off": {
                              "S": "F"
                            },
                            "d403_d_o_rating": {
                              "S": "K"
                            },
                            "d403_dac": {
                              "S": ""
                            },
                            "d403_dt_chged": {
                              "S": "2016183"
                            },
                            "d403_dt_last_pur": {
                              "S": "2016029"
                            },
                            "d403_dt_loaded": {
                              "S": "1980306"
                            },
                            "d403_dt_reset": {
                              "S": "2011273"
                            },
                            "d403_est_prc": {
                              "N": "9.1"
                            },
                            "d403_fy_po": {
                              "N": "3"
                            },
                            "d403_fy_po_qty": {
                              "N": "17"
                            },
                            "d403_fy_reqn": {
                              "N": "8"
                            },
                            "d403_fy_reqn_qty": {
                              "N": "22"
                            },
                            "d403_item_ind": {
                              "S": "1"
                            },
                            "d403_mgr_cd": {
                              "S": ""
                            },
                            "d403_mop_cd": {
                              "S": "87"
                            },
                            "d403_nsn_5": {
                              "S": "0"
                            },
                            "d403_nsn_6_15": {
                              "S": "00126662"
                            },
                            "d403_phrase_cd": {
                              "S": ""
                            },
                            "d403_proj_cd_pr": {
                              "S": ""
                            },
                            "d403_proper_name": {
                              "S": ""
                            },
                            "d403_psc_cd": {
                              "S": "5306"
                            },
                            "d403_psm_qty": {
                              "N": "0"
                            },
                            "d403_sched_no": {
                              "S": ""
                            },
                            "d403_source_info_1": {
                              "NULL": true
                            },
                            "d403_source_info_10": {
                              "NULL": true
                            },
                            "d403_source_info_11": {
                              "NULL": true
                            },
                            "d403_source_info_12": {
                              "NULL": true
                            },
                            "d403_source_info_2": {
                              "NULL": true
                            },
                            "d403_source_info_3": {
                              "NULL": true
                            },
                            "d403_source_info_4": {
                              "NULL": true
                            },
                            "d403_source_info_5": {
                              "NULL": true
                            },
                            "d403_source_info_6": {
                              "NULL": true
                            },
                            "d403_source_info_7": {
                              "NULL": true
                            },
                            "d403_source_info_8": {
                              "NULL": true
                            },
                            "d403_source_info_9": {
                              "NULL": true
                            },
                            "d403_spec_no": {
                              "S": ""
                            },
                            "d403_stk_nstk_ind": {
                              "S": "N"
                            },
                            "d403_sub_nsn": {
                              "S": ""
                            },
                            "d403_type_id_cd": {
                              "S": "4"
                            },
                            "d403_ui": {
                              "S": "BX"
                            },
                            "d403_uii": {
                              "S": ""
                            },
                            "d403_un_id": {
                              "S": ""
                            },
                            "d403_ut_cube": {
                              "N": "0.04"
                            },
                            "d403_ut_wgt": {
                              "N": "4"
                            },
                            "d403_vendor_partno": {
                              "S": ""
                            }
                          }
                        },
                        "pk": {
                          "S": "000126662"
                        },
                        "sk": {
                          "S": "nif_details"
                        }
                      },
                },
            },
            
        ],
    },
};

dynamodb.batchWriteItem(params1, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data);
    }
});