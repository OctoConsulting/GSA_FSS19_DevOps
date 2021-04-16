import { getDBSettings } from '../config';

export async function checkForExistingNsn(routing_id: string) {
    let queryStr: string =
        'SELECT count(*) as CNT FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routing_id + "'";
    console.log('Executing query inside checkForExistingNsn - ' + queryStr);

    let result: any = await getDBSettings().CONNECTION.promise().query(queryStr);

    let recordCount: number = 0;

    result.forEach((row: any) => {
        recordCount = row[0].CNT ? row[0].CNT : recordCount;
    });

    console.log('Got routing_id in checkForExistingNsn = ' + recordCount);
    return recordCount == 1 ? true : false;
}
