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
    TableName: 'entity-data-' + (!process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV),
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
        'entity-data-dev': [
            {
                PutRequest: {
                    Item: {
                        "details": {
                            "M": {
                              "d410_actn_dt": {
                                "S": ""
                              },
                              "d410_adrs2": {
                                "S": ""
                              },
                              "d410_adrs3": {
                                "S": ""
                              },
                              "d410_aloc_ppp": {
                                "S": ""
                              },
                              "d410_cage_code": {
                                "S": ""
                              },
                              "d410_cec": {
                                "S": "00012403C"
                              },
                              "d410_city_name": {
                                "S": "MODESTO"
                              },
                              "d410_cntry_cd": {
                                "S": "USA"
                              },
                              "d410_congress_dist": {
                                "N": "0"
                              },
                              "d410_db_out_busind": {
                                "S": ""
                              },
                              "d410_delinquent_flag": {
                                "S": ""
                              },
                              "d410_dod": {
                                "S": ""
                              },
                              "d410_dodaac": {
                                "S": ""
                              },
                              "d410_edi_id_1": {
                                "S": ""
                              },
                              "d410_edi_id_2": {
                                "S": ""
                              },
                              "d410_efpt_ind": {
                                "S": "F"
                              },
                              "d410_email_adrs": {
                                "S": ""
                              },
                              "d410_exclusion_stat": {
                                "S": ""
                              },
                              "d410_filler1": {
                                "S": ""
                              },
                              "d410_filler2": {
                                "S": ""
                              },
                              "d410_filler3": {
                                "S": ""
                              },
                              "d410_foreign_st": {
                                "S": ""
                              },
                              "d410_inet_adrs": {
                                "S": ""
                              },
                              "d410_lst_dt_chg": {
                                "S": ""
                              },
                              "d410_lst_ext_code": {
                                "S": ""
                              },
                              "d410_mail_adrs1": {
                                "S": ""
                              },
                              "d410_mail_adrs2": {
                                "S": ""
                              },
                              "d410_mail_adrs_pc": {
                                "S": ""
                              },
                              "d410_mail_city_nm": {
                                "S": ""
                              },
                              "d410_mail_country": {
                                "S": ""
                              },
                              "d410_mail_for_st": {
                                "S": ""
                              },
                              "d410_mail_st": {
                                "S": ""
                              },
                              "d410_mail_zip": {
                                "S": ""
                              },
                              "d410_name12": {
                                "S": "GIBSON-HOMAN"
                              },
                              "d410_name13_15": {
                                "S": "S"
                              },
                              "d410_name17": {
                                "S": ""
                              },
                              "d410_name33_120": {
                                "S": ""
                              },
                              "d410_name_as": {
                                "S": ""
                              },
                              "d410_optout_pdisp": {
                                "S": ""
                              },
                              "d410_phone_no": {
                                "S": ""
                              },
                              "d410_prime_naics": {
                                "S": ""
                              },
                              "d410_st": {
                                "S": "CA"
                              },
                              "d410_status": {
                                "S": ""
                              },
                              "d410_user_id": {
                                "S": ""
                              },
                              "d410_zip": {
                                "S": "95391"
                              }
                            }
                          },
                          "pk": {
                            "S": "00012403C"
                          },
                          "sk": {
                            "S": "address"
                          }

                       // details: { S: '{"d410_actn_dt":"2020226","d410_adrs1":"JTF BUSINESS SOLUTIONS CORP","d410_name15":"JTF BUSINESS SO","d410_name12":"JTF BUSINESS","d410_name13_15":"SO","d410_name17":"LUTIONS CORP","d410_name33_120":"","d410_adrs2":"85 S BRAGG ST STE 601","d410_adrs3":"","d410_city_name":"ALEXANDRIA","d410_st":"VA","d410_zip":"223122798","d410_aloc_ppp":"5101000","d410_cage_code":"82L11","d410_cec":"024042079","d410_edi_id_1":"","d410_edi_id_2":"","d410_efpt_ind":"F","d410_phone_no":"703-658-2000","d410_email_adrs":"","d410_inet_adrs":"www.jtfgov.com","d410_user_id":"D4002900 UPDATE-FROM-CCR","d410_status":"A","d410_cntry_cd":"USA","d410_name_as":"","d410_lst_dt_chg":"20200802","d410_lst_ext_code":"A","d410_foreign_st":"","d410_mail_adrs_pc":"JTF BUSINESS SOLUTIONS CORP","d410_mail_adrs1":"7368 STEEL MILL DRIVE","d410_mail_adrs2":"","d410_mail_city_nm":"SPRINGFIELD","d410_mail_st":"VA","d410_mail_zip":"22150","d410_mail_country":"USA","d410_mail_for_st":"","d410_optout_pdisp":"","d410_congress_dist":"8","d410_prime_naics":"423420","d410_db_out_busind":"","d410_delinquent_flag":"N","d410_exclusion_stat":"","d410_sam_dodaac":"","d410_dod":"","d410_dodaac":""}' },
                    },
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