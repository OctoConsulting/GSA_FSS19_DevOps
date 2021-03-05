import { DateTime } from "aws-sdk/clients/devicefarm";

export interface NsnData {
    group_id: number,
    routing_id: string,
    owa: string,
    isCivMgr: string,
    isMilMgr: string,
    ric: string,
    createdBy?: string,
    createDate?: string;
}
