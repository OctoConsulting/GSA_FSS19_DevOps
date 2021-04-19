import { Component, OnInit } from '@angular/core';
import USWDS from "uswds/src/js/components";
import { NSNFormModel, NSNModel } from './nsn-model';
const { tooltip } = USWDS;

@Component({
  selector: 'app-nsn-add',
  templateUrl: './nsn-add.component.html'
})
export class NsnAddComponent implements OnInit {

  ref: HTMLElement;

  nsnFormModel: NSNFormModel;

  recordFound: boolean = false;

  confirmStatus: string = 'U';

  nsnInputMask = {
    guide: false,
    showMask: false,
    modelClean: true,
    mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\s/]
  }

  contractOffices: Array<any> = [
    { key: "F", value: "F - Forth Worth" },
    { key: "M", value: "M - Kansas City (Tools Center)" },
    { key: "N", value: "New York" },
    { key: "P", value: "Philadelphia" },
  ];

  constructor() {
    this.ref = document.body;
    this.nsnFormModel = new NSNFormModel();
  }

  ngOnInit(): void {
    tooltip.on();
  }

  ngOnDestroy() {
    tooltip.off();
  }

  searchHandler() {
    this.nsnFormModel.nsn = this.nsnFormModel.nsn?.replace(/(-*\s*)$/, '');
    if(this.nsnFormModel.nsn == '3510') {
      this.recordFound = true;
      return;
    }
    this.recordFound = false;
  }

  addRecordHandler() {
    this.confirmStatus = 'I';
  }

  editHandler() {
    this.confirmStatus = 'U';
  }

  confirmHandler() {
    this.confirmStatus = 'C';
  }

  get validationPassed() {
    return (this.nsnFormModel.nsn?.length > 1 && this.nsnFormModel.contractOffice?.key.length > 0 &&
      (!this.routingIdentifierRequired || this.nsnFormModel.routingIdentifierCode?.length > 0));
  }

  get routingIdentifierRequired() {
    return ((this.nsnFormModel.dodCivilianManager == 'false' && this.nsnFormModel.dodMilitaryManager == 'true') ||
      (this.nsnFormModel.dodCivilianManager == 'true' && this.nsnFormModel.dodMilitaryManager == 'true'));

  }
}
