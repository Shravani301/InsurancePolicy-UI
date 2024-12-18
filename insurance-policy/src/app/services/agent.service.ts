import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = 'https://localhost:7052/api'; // Replace with your actual API URL
 
  constructor(private http: HttpClient) {}

    getCommissionsByAgentId(agentId: string): Observable<any> {
      const url = `${this.baseUrl}/commission/agent/${agentId}`;
      return this.http.get<any>(url, { observe: 'response' });
    }
  
    getTotalCommissionByAgent(agentId: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/WithdrawalRequest/agent/${agentId}/total-commission`, {
        observe: 'response',
      });
    }
    getCustomerProfilesByAgentId(agentId:any):Observable<any>{const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token-based authentication
    });
  
    const url = `${this.baseUrl}/Customer/agent/${agentId}/customers`;
    return this.http.get<any>(url, { observe: 'response' });
 }  

 getAgentProfile(id: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token-based authentication
  });

  // API call with the provided `id`
  return this.http.get<any>(`${this.baseUrl}/agent/${id}`, { observe: 'response' });
}  

updateAgentProfile(data:any): Observable<any> {
  return this.http.put(`${this.baseUrl}/Agent/Profile`,data, { observe: 'response' });
}
getCustomersByAgentId(id: string,pageNumber:number,pageSize:number): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token-based authentication
  });

  // API call with the provided `id`
  return this.http.get<any>(
    `${this.baseUrl}/Customer/agent/${id}/customers`, 
    { 
      params: { 
        PageNumber: pageNumber.toString(), 
        PageSize: pageSize.toString() 
      },
      observe: 'response' 
    }
  );
  
}  
getPoliciesByAgentId(userId: string, pageNumber: number, pageSize: number): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const url = `https://localhost:7052/api/Policy/agent/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
  return this.http.get<any>(url, { headers, observe: 'response' });
}

getWithdrawalRequestsByAgentId(agentId: number,pageNumber: number, pageSize: number): Observable<any>  {
  return this.http.get(`${this.baseUrl}/WithdrawalRequest/agent/${agentId}`, {
    observe: 'response',
  });
}
addWithdrawalRequest(data: any): Observable<any>
{
  return this.http.post(`${this.baseUrl}/withdrawalRequest`,data, {
    observe: 'response',
  });
}
}
