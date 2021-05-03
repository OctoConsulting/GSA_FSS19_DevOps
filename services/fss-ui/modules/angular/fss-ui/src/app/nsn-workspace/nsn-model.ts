export class NSNModel {
    group: RoutingModel[] = new Array<RoutingModel>();

    class: RoutingModel[] = new Array<RoutingModel>();

    nsn: RoutingModel[] = new Array<RoutingModel>();
}

export class RoutingModel {
    routing_id: string;

    owa: string;

    is_civ_mgr: string = 'N';

    is_mil_mgr: string = 'N';

    ric: string;

    updated_date: string;

}
