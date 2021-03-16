import { DateTime } from 'aws-sdk/clients/devicefarm';

export interface NsnData {
    group_id?: number;
    routing_id: string;
    owa: string;
    is_civ_mgr: string;
    is_mil_mgr: string;
    ric?: string;
    type?: string;
    update_date?: string;
    updated_by?: string;
    created_by?: string;
    create_date?: string;
}
