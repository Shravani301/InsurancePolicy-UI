import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TotalService {

  constructor(private http: HttpClient) {}
  
  private baseUrl = 'https://localhost:7052/api';
  getCustomerCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Customer/totalCustomers`,{ observe: 'response' });
  }
  getPlanCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/InsurancePlan/count`,{ observe: 'response' });
  }
  getAgentCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Agent/total`,{ observe: 'response' });
  }
  getSchemeCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/InsuranceScheme/count`,{ observe: 'response' });
  }
  getCommissionCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Commission/count`,{ observe: 'response' });
  }

  getPaymentCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Payment/count`,{ observe: 'response' });
  }
  getEmployeeCount():Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Employee/count`,{ observe: 'response' });

  }
  getClaimCount(): Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/Claim/count`,{ observe: 'response' });
  }
  getComplaintCount():Observable<any>
  {
    return this.http.get<number>(`${this.baseUrl}/CustomerQuery/count`,{ observe: 'response' });
  }

}
