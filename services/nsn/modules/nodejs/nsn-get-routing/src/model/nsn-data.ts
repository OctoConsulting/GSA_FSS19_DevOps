import { DateTime } from 'aws-sdk/clients/devicefarm';

export interface NsnData {
    routing_id: string;
    owa: string;
    is_civ_mgr: string;
    is_mil_mgr: string;
    ric?: string;
    routing_id_category?: string;
    change_date: DateTime;
    changed_by: string;
    created_by?: string;
    create_date?: DateTime;
}
