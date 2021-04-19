export class NSNModel {
	nsn: string;

	groupRoutings: GroupRoutingModel[] = new Array<GroupRoutingModel>();

    classRoutings: ClassRoutingModel[] = new Array<ClassRoutingModel>();

    nsnRoutings: NSNRoutingModel[] = new Array<NSNRoutingModel>();
}

export class GroupRoutingModel {
    group: string;

    commodityCenter: string;

    civilianManager: string;

    militaryManager: string;

    routingIdentifierCode: string;

    lastModified: string;
}

export class ClassRoutingModel {
    group: string;

    commodityCenter: string;

    civilianManager: string;

    militaryManager: string;

    routingIdentifierCode: string;

    lastModified: string;
}

export class NSNRoutingModel {
    nationalStockNumber: string;

    commodityCenter: string;

    civilianManager: string;

    militaryManager: string;

    routingIdentifierCode: string;

    lastModified: string;
}

export class NSNFormModel {
    nsn: string;

    contractOffice: any;

    dodCivilianManager: string = 'false';

    dodMilitaryManager: string = 'false';

    routingIdentifierCode: string;
}