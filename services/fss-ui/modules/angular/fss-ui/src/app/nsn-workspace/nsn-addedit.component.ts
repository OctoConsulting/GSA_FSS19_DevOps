import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import USWDS from "uswds/src/js/components";
import { NSNService } from '../api-service/nsn.service';
import { NSNModel, RoutingModel } from './nsn-model';
const { tooltip } = USWDS;

@Component({
  selector: 'app-nsn-addedit',
  templateUrl: './nsn-addedit.component.html'
})
export class NSNAddEditComponent implements OnInit {

  ref: HTMLElement;

  nsnModel: RoutingModel;

  recordFound: boolean = false;

  confirmStatus: string = 'U';

  pageOptions: any = {
    'add': {
      'label': 'Add',
      'button': 'Add New Record'
    },
    'edit': {
      'label': 'Edit',
      'button': 'Save Changes'
    }
  }

  pageMode: string = 'add';

  nsnInputMask = {
    guide: false,
    showMask: false,
    modelClean: true,
    mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\s/]
  }

  contractOffice: any;

  contractOffices: Array<any> = [
    { key: "F", value: "F - Forth Worth" },
    { key: "M", value: "M - Kansas City (Tools Center)" },
    { key: "N", value: "N - New York" },
    { key: "P", value: "P - Philadelphia" },
  ];

  private queryParams: Subscription;

  constructor(private aroute: ActivatedRoute, private router: Router, private nsnService: NSNService) {
    this.ref = document.body;
    this.nsnModel = new RoutingModel();
  }

  ngOnInit(): void {
    this.queryParams = this.aroute.queryParams.subscribe(params => {
      if (params['routing_id']) {
        this.editSearchHandler(params['routing_id']);
      } else {
        this.router.navigate(['/nsn/add']);
      }
    });

    setTimeout(() => {
      tooltip.on();
    }, 100);
  }

  ngOnDestroy() {
    tooltip.off();
    this.queryParams.unsubscribe();
  }

  editSearchHandler(routing_id: string) {
    routing_id = routing_id?.replace(/-/g, '');
    
    this.nsnService.getNSNRoutingData(routing_id, 'strict').subscribe(data => {
      if (data && data.routing_id) {
        this.pageMode = 'edit';
        this.nsnModel = data;
        this.contractOffice = this.getContractOffice(data.owa);
      } else {
        this.pageMode = 'add';
        this.router.navigate(['/nsn/add']);
      }
    });
  }

  searchHandler() {
    const routing_id = this.nsnModel.routing_id?.replace(/-/g, '');
   
    this.nsnService.getNSNRoutingData(routing_id, 'strict').subscribe(data => {
      this.nsnModel = new RoutingModel();
      this.nsnModel.routing_id = routing_id;

      if (data && data.routing_id) {
        this.recordFound = true;
      } else {
        this.recordFound = false;
      }
    });
  }

  saveChanges() {
    this.nsnModel.owa = this.contractOffice.key;
    this.confirmStatus = 'I';
  }

  editHandler() {
    this.confirmStatus = 'U';
  }

  confirmHandler() {
    if (this.pageMode == 'add') {
      this.nsnService.createNSNRoutingData(this.nsnModel).subscribe(data => {
        if(data && data.routing_id) {
          this.confirmStatus = 'C';
        }
      });
    } else {
      this.nsnService.updateNSNRoutingData(this.nsnModel).subscribe(data => {
        if(data && data.routing_id) {
          this.confirmStatus = 'C';
        }
      });
    }
  }

  get validationPassed() {
    return (!this.recordFound && this.nsnModel.routing_id?.length > 1 && this.contractOffice?.key.length > 0 &&
      (!this.routingIdentifierRequired || this.nsnModel.ric?.length > 2));
  }

  get routingIdentifierRequired() {
    return this.nsnModel.is_civ_mgr != 'N' || this.nsnModel.is_mil_mgr != 'N';
  }

  getContractOffice(key: string) {
    for (var index in this.contractOffices) {
      if (this.contractOffices[index].key == key) {
        return this.contractOffices[index];
      }
    }
    return {};
  }

  get confirmLabel() {
    if(this.nsnModel.routing_id.length == 2) {
      return 'Group (FSG)'
    } else if(this.nsnModel.routing_id.length == 4) {
      return 'Class (FSG)'
    } else {
      return 'NSN';
    }
  }
}
