import { getDBSettings, executeQuery } from '../config';

export async function checkForExistingNsn(routing_id: string) {
    let queryStr: string =
        'SELECT count(*) as CNT FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routing_id + "'";
    console.log('Executing query inside checkForExistingNsn - ' + queryStr);

    let recordCount: number = 0;

    await executeQuery(queryStr, null)
        .then((response: any) => {
            recordCount = response && response.result && response.result[0] ? response.result[0].CNT : 0;
        })
        .catch((error: any) => {
            recordCount = 0;
        });

    console.log('Got routing_id in checkForExistingNsn = ' + recordCount);
    return recordCount == 1 ? true : false;
}
