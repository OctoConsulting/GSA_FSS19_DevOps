import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NSNModel, RoutingModel } from '../nsn-workspace/nsn-model';

const NSNRoutingToken = `${environment.NSN_ROUTING_API_TOKEN}`

@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(private http: HttpClient) { }

  getNSNRoutingData(url: string, params) {
    const requestOptions = {
      headers: new HttpHeaders({ 'x-apigw-api-id': NSNRoutingToken }),
    };
    return this.http.post<NSNModel[]>(url, params, requestOptions);
  }

  createNSNRoutingData(url: string, model: RoutingModel) {
    const requestOptions = {
      headers: new HttpHeaders({ 'x-apigw-api-id': NSNRoutingToken }),
    };
    return this.http.post(url, model, requestOptions);
  }

  updateNSNRoutingData(url: string, model: RoutingModel) {
    const requestOptions = {
      headers: new HttpHeaders({ 'x-apigw-api-id': NSNRoutingToken }),
    };
    return this.http.put(url, model, requestOptions);
  }
}
