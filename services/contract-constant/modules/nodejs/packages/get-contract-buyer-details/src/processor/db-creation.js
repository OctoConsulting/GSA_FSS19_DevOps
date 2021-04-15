//scrantonTable.js

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
console.log('contract-const-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV));
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: 'contract-const-data' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
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
    TableName: 'contract-const-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
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
        'contract-const-data-dev': [
            {
                PutRequest: {
                    Item: {
                      
                        "details": {
                          "M": {
                            "d430_bm_cd": {
                              "S": "TG"
                            },
                            "d430_bm_cd_alt": {
                              "S": ""
                            },
                            "d430_bm_dval_lmt": {
                              "N": "9999999"
                            },
                            "d430_bm_name": {
                              "S": "Tamara D. Grant"
                            },
                            "d430_bm_phone_no": {
                              "S": ""
                            },
                            "d430_email_adrs": {
                              "S": ""
                            }
                          }
                        },
                        "pk": {
                          "S": "1"
                        },
                        "sk": {
                          "S": "detail_d430_B_TG"
                        }
                      }
                },
            },
            
            // {
            //     PutRequest: {
            //         Item: {
            //             pk: { S: '784141384' },
            //             sk: { S: 'address' },
            //            // details: { S: '{"d410_actn_dt":"2020321","d410_adrs1":"PREMIER & COMPANIES, INC.","d410_name15":"PREMIER & COMPA","d410_name12":"PREMIER & CO","d410_name13_15":"MPA","d410_name17":"NIES, INC.","d410_name33_120":"","d410_adrs2":"525 WINDSOR DR","d410_adrs3":"","d410_city_name":"SECAUCUS","d410_st":"NJ","d410_zip":"070942708","d410_aloc_ppp":"3699061","d410_cage_code":"3Z0C0","d410_cec":"024042079","d410_edi_id_1":"","d410_edi_id_2":"","d410_efpt_ind":"F","d410_phone_no":"212-947-1365","d410_email_adrs":"sfein@premierandco.com","d410_inet_adrs":"http://www.premierandcompanies.com","d410_user_id":"D4002900 UPDATE-FROM-CCR","d410_status":"A","d410_cntry_cd":"USA","d410_name_as":"","d410_lst_dt_chg":"20201114","d410_lst_ext_code":"3","d410_foreign_st":"","d410_mail_adrs_pc":"PREMIER & COMPANIES, INC.","d410_mail_adrs1":"237 WEST 35TH STREET","d410_mail_adrs2":"15TH FLOOR","d410_mail_city_nm":"NEW YORK","d410_mail_st":"NY","d410_mail_zip":"100012508","d410_mail_country":"USA","d410_mail_for_st":"","d410_optout_pdisp":"","d410_congress_dist":"9","d410_prime_naics":"424120","d410_db_out_busind":"","d410_delinquent_flag":"N","d410_exclusion_stat":"","d410_sam_dodaac":"","d410_dod":"","d410_dodaac":""}' },
            //         },
            //     },
            // },
        ]
    },
};

dynamodb.batchWriteItem(params1, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data);
    }
});