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

export async function getExistingNsnDetail(routing_id: string) {
    let queryStr: string =
        'SELECT * FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routing_id + "'";
    console.log('Executing query inside checkForExistingNsn - ' + queryStr);

    let result: any;

    await executeQuery(queryStr, null)
        .then((response: any) => {
            result = response && response.result && response.result[0] ? response.result[0] : [];
        })
        .catch((error: any) => {
            result = [];
        });

    console.log('Got routing_id in checkForExistingNsn = ' + result);
    return result;
}

const isLeapYear = function (date: Date) {
    var year = date.getFullYear();
    if ((year & 3) != 0) return false;
    return year % 100 != 0 || year % 400 == 0;
};

export function getOrdinalDate(date: Date): string {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = date.getMonth();
    var dn = date.getDate();
    var yearYY = (date.getFullYear() + '').substring(2, 4);
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && isLeapYear(date)) dayOfYear++;
    return yearYY + dayOfYear;
}
