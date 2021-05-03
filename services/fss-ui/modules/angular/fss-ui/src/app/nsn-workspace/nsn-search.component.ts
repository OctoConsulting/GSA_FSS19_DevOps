import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NSNService } from '../api-service/nsn.service';
import { NSNModel, RoutingModel } from './nsn-model';

import USWDS from 'uswds/src/js/components';
const { tooltip } = USWDS;

@Component({
    selector: 'app-nsn-search',
    templateUrl: './nsn-search.component.html',
})
export class NSNSearchComponent implements OnInit {
    ref: HTMLElement;

    nsn: string = '';

    nsnInput: string = '';

    recordFound: boolean = false;

    validationFailed: boolean = false;

    nsnInputMask = {
        guide: false,
        showMask: false,
        modelClean: true,
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\s/],
    };

    nsnModel: NSNModel;
    deleteRoutingId: string = '';
    isDeleteChecked: boolean = false;

    constructor(private router: Router, private nsnService: NSNService) {
        this.ref = document.body;
    }

    ngOnInit(): void {
        tooltip.on();
    }

    ngOnDestroy() {
        tooltip.off();
    }

    searchHandler() {
        this.nsnModel = new NSNModel();
        this.nsnInput = this.nsnInput.replace(/(-*\s*)$/, '');

        if (this.nsnInput.length < 2) {
            this.nsn = this.nsnInput;
            this.validationFailed = true;
            return;
        }
        this.validationFailed = false;
        this.callService();
    }

    callService() {
        this.nsnService.getNSNRoutingData(this.nsnInput, 'all').subscribe((data) => {
            this.nsnModel = data;

            if (this.nsnModel) {
                this.recordFound = true;
            } else {
                this.recordFound = false;
            }

            this.nsn = this.nsnInput;
        });
        //this.nsnModel = this.mockNSNServiceResponse();
    }

    onEditHandler(routing) {
        this.router.navigate(['/nsn/edit'], { queryParams: { routing_id: routing } });
    }

    onDeleteHandler(routing) {
        console.log(routing);
        this.router.navigate(['/nsn/delete'], { queryParams: { routing_id: routing } });
    }

    mockNSNServiceResponse() {
        let model: NSNModel = new NSNModel();

        let groupRoutingModel: RoutingModel = new RoutingModel();
        groupRoutingModel.routing_id = '35';
        groupRoutingModel.owa = 'F';
        groupRoutingModel.is_civ_mgr = 'N';
        groupRoutingModel.is_mil_mgr = 'Y';
        groupRoutingModel.ric = 'SMS';
        groupRoutingModel.updated_date = '07/12/2007';
        model.group.push(groupRoutingModel);

        let classRoutingModel: RoutingModel = new RoutingModel();
        classRoutingModel.routing_id = '3510';
        classRoutingModel.owa = 'F';
        classRoutingModel.is_civ_mgr = 'N';
        classRoutingModel.is_mil_mgr = 'Y';
        classRoutingModel.ric = 'SMS';
        classRoutingModel.updated_date = '03/05/2009';
        model.class.push(classRoutingModel);

        let nsnRoutingModel: RoutingModel = new RoutingModel();
        nsnRoutingModel.routing_id = '3510-00-222-1457';
        nsnRoutingModel.owa = 'F';
        nsnRoutingModel.is_civ_mgr = 'N';
        nsnRoutingModel.is_mil_mgr = 'N';
        nsnRoutingModel.ric = '';
        nsnRoutingModel.updated_date = '05/13/1991';
        model.nsn.push(nsnRoutingModel);

        return model;
    }

    openModal(routing_id: string) {
        console.log('Deleting routing id - ' + routing_id);
        this.deleteRoutingId = routing_id;
    }

    checkDelete = (evt) => {
        console.log('Current delete checked = ' + evt.target.checked);
        this.isDeleteChecked = evt.target.checked;
    };
}
