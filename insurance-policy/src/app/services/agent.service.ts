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
      const url = `${this.baseUrl}/commissions/agent/${agentId}`;
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
}
