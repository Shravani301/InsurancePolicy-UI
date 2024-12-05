import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Base API URL
  private baseUrl = 'https://localhost:7052/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetch customers with pagination.
   * @param pageNumber Current page number
   * @param pageSize Number of items per page
   * @returns Observable with the customer data
   */
  getCustomers(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Customer?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      observe: 'response',
    });
  }

  /**
   * Fetch claims with pagination.
   * @param pageNumber Current page number
   * @param pageSize Number of items per page
   * @returns Observable with the claim data
   */
  getClaims(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Claim?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      observe: 'response',
    });
  }
  

  /**
   * Approve a claim by its ID.
   * @param claimId The ID of the claim to approve
   * @returns Observable with the response
   */
  approveClaim(claimId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/Claim/${claimId}/approve`, {}, { observe: 'response' });
  }
  

  /**
   * Reject a claim by its ID with a reason.
   * @param claimId The ID of the claim to reject
   * @param reason The reason for rejection
   * @returns Observable with the response
   */
  rejectClaim(claimId: string, reason: string): Observable<any> {
    const payload = { reason };
    return this.http.put(`${this.baseUrl}/Claim/${claimId}/reject`, payload, { observe: 'response' });
  }
  
}
