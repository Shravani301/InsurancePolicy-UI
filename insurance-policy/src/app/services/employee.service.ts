import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'https://localhost:7052/api'; // Base URL for CustomerQuery API

  constructor(private http: HttpClient) {}

  /**
   * Fetch customer complaints with pagination.
   * @param pageNumber Current page number
   * @param pageSize Number of items per page
   * @param searchQuery Optional search query for filtering complaints
   * @returns Observable with paginated complaints
   */
  /**
 * Fetch customer queries with pagination.
 * @param pageNumber Current page number
 * @param pageSize Number of items per page
 * @param searchQuery Optional search query for filtering
 * @returns Observable with the customer query data
 */
getCustomerQueries(pageNumber: number, pageSize: number, searchQuery?: string): Observable<any> {
  let url = `${this.baseUrl}/CustomerQuery?PageNumber=${pageNumber}&PageSize=${pageSize}`;
  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }
  return this.http.get<any>(url, { observe: 'response' });
}


  /**
   * Fetch a specific complaint by its ID.
   * @param queryId The ID of the complaint to fetch
   * @returns Observable with complaint details
   */
  getComplaintById(queryId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${queryId}`, { observe: 'response' });
  }

  /**
   * Update a complaint with a response.
   * @param complaint The updated complaint object
   * @returns Observable with the update response
   */
  updateComplaint(complaint: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, complaint, { observe: 'response' });
  }

  /**
   * Resolve a complaint by its ID.
   * @param queryId The ID of the complaint to resolve
   * @returns Observable with the resolution response
   */
  resolveComplaint(queryId: string, response: string, employeeId: string): Observable<any> {
    const params = new HttpParams()
      .set('response', response)
      .set('employeeId', employeeId);
  
    return this.http.put<any>(`${this.baseUrl}/CustomerQuery/${queryId}/resolve`, null, { params });
  }
  
  updateProfile(data:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Employee/Profile`,data, { observe: 'response' });
  }
  /**
   * Fetch all complaints for a specific customer by their ID.
   * @param customerId The ID of the customer
   * @returns Observable with customer complaints
   */
  getComplaintsByCustomerId(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/customer/${customerId}`, { observe: 'response' });
  }

  resolveQuery(queryId:any,response:any,empId:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/CustomerQuery/${queryId}/resolve?response=${response}&employeeId=${empId}`, { observe: 'response'})
  }
  
  rejectDocument(docId: any,empId:any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Document/reject/${docId}?employeeId=${empId}`,
      {},
      { observe: 'response' }
    );
  } approveDocument(docId: any,empId:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Document/approve/${docId}?employeeId=${empId}`, {}, { observe: 'response' });
  }

  getDocumentById(documentId: string): Observable<any> {
    return this.http.get<any>(`/api/Document/${documentId}`);
  }
  
  
  rejectPolicy(policyId: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Policy/${policyId}/reject`,{ observe: 'response' });
  } approvePolicy(policyId: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Policy/${policyId}/approve`,
      {},
      { observe: 'response' }
    ); }

    getEmployeeProfile(id: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token-based authentication
      });
    
      // API call with the provided `id`
      return this.http.get<any>(`${this.baseUrl}/employee/${id}`, { observe: 'response' });
    }  
}
