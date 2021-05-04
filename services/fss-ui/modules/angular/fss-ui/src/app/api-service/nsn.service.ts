import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RoutingModel } from '../nsn-workspace/nsn-model';
import { APIService } from './api-service';

const BaseUrl = `${environment.BASE_URL}/nsnrouting/v1`;

@Injectable({
  providedIn: 'root'
})
export class NSNService {

  constructor(private apiService: APIService) { }

  getNSNRoutingData(routing: string, mode: string) {
    return this.apiService.getNSNRoutingData(BaseUrl + '/details/paginated', { routing_id: routing, mode: mode }).pipe(
      catchError((err) => {
        return observableOf({});
      }),
      map((res: any) => res)
    );
  }

  createNSNRoutingData(model: RoutingModel) {
    return this.apiService.createNSNRoutingData(BaseUrl + '/details', model).pipe(
      catchError((err) => {
        return observableOf({});
      }),
      map((res: any) => res)
    );
  }

  updateNSNRoutingData(model: RoutingModel) {
    return this.apiService.updateNSNRoutingData(BaseUrl + '/details', model).pipe(
      catchError((err) => {
        return observableOf({});
      }),
      map((res: any) => res)
    );
  }

  deleteNSNRoutingData(routing: string) {
    return this.apiService.deleteNSNRoutingData(BaseUrl + '/details/'+routing).pipe(
      catchError((err) => {
        return observableOf({});
      }),
      map((res: any) => res)
    );
  }

}
