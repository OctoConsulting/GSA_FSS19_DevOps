import { Component, Input, OnInit } from '@angular/core';
import USWDS from "uswds/src/js/components";
import { ClassRoutingModel, GroupRoutingModel, NSNModel, NSNRoutingModel } from './nsn-model';
const { tooltip } = USWDS;

@Component({
  selector: 'app-nsn-search',
  templateUrl: './nsn-search.component.html'
})
export class NsnSearchComponent implements OnInit {

  ref: HTMLElement;

  nsn: string = '';

  nsnInput: string = '';

  recordFound: boolean = false;

  validationFailed: boolean = false;

  nsnInputMask = {
    guide: false,
    showMask: false,
    modelClean: true,
    mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\s/]
  }

  nsnModel: NSNModel;

  constructor() {
    this.ref = document.body;
  }

  ngOnInit(): void {
    tooltip.on();
  }

  ngOnDestroy() {
    tooltip.off();
  }

  searchHandler() {
    this.recordFound = false;
    this.nsnModel = new NSNModel();
    this.nsn = this.nsnInput = this.nsnInput.replace(/(-*\s*)$/, '');

    if (this.nsnInput.length < 2) {
      this.validationFailed = true;
      return;
    }

    this.validationFailed = false;
    

    this.callService();
  }

  callService() {
    if (this.nsn != '3510') {
      this.nsnModel = new NSNModel();
      return;
    }

    this.recordFound = true;
    this.nsnModel = this.mockNSNServiceResponse();
  }

  mockNSNServiceResponse() {
    let model: NSNModel = new NSNModel();
    model.nsn = '3510';
    
    let groupRoutingModel: GroupRoutingModel = new GroupRoutingModel();
    groupRoutingModel.group = '35';
    groupRoutingModel.commodityCenter = 'F';
    groupRoutingModel.civilianManager = 'N';
    groupRoutingModel.militaryManager = 'Y';
    groupRoutingModel.routingIdentifierCode = 'SMS';
    groupRoutingModel.lastModified = '07/12/2007';
    model.groupRoutings.push(groupRoutingModel);

    let classRoutingModel: ClassRoutingModel = new ClassRoutingModel();
    classRoutingModel.group = '3510';
    classRoutingModel.commodityCenter = 'F';
    classRoutingModel.civilianManager = 'N';
    classRoutingModel.militaryManager = 'Y';
    classRoutingModel.routingIdentifierCode = 'SMS';
    classRoutingModel.lastModified = '03/05/2009';
    model.classRoutings.push(classRoutingModel);
    
    let nsnRoutingModel: NSNRoutingModel = new NSNRoutingModel();
    nsnRoutingModel.nationalStockNumber = '3510-00-222-1457';
    nsnRoutingModel.commodityCenter = 'F';
    nsnRoutingModel.civilianManager = 'N';
    nsnRoutingModel.militaryManager = 'N';
    nsnRoutingModel.routingIdentifierCode = '';
    nsnRoutingModel.lastModified = '05/13/1991';
    model.nsnRoutings.push(nsnRoutingModel);

    return model;
  }
}
