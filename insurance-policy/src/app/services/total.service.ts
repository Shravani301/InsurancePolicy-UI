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
  getAgentsCountByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Agent/Agents/count?customerId=${customerId}`, { observe: 'response' });
  }

  getClaimsCountByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Claim/customercount?customerId=${customerId}`, { observe: 'response' });
  }

  getPoliciesCountByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Policy/CustomerCount?customerId=${customerId}`, { observe: 'response' });
  }

  getDocumentsCountByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Document/CustomerCount?customerId=${customerId}`, { observe: 'response' });
  }

  getCustomerQueryCountByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/CustomerQuery/customercount?customerId=${customerId}`, { observe: 'response' });
  }
  getCustomersCountByAgentId(agentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Agent/customerByAgent/${agentId}`, { observe: 'response' });
  }

  getPoliciesCountByAgentId(agentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Policy/policyByAgent/${agentId}`, { observe: 'response' });
  }

  getCommissionsCountByAgentId(agentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Agent/commissionByAgent/${agentId}`, { observe: 'response' });
  }
  getWithdrawlCount():Observable<any> {
    return this.http.get<number>(`${this.baseUrl}/WithdrawalRequest/count`,{ observe: 'response' });
  }
}
