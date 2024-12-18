import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'https://localhost:7052/api';
  private backendUrl = 'https://localhost:7052/api/Document';
  constructor(private http: HttpClient) {}

  getProfile(){
    let name=localStorage.getItem('userName');
    return this.http.get(this.baseUrl+"/Admin/ByName/"+name);
  }
  contactUs(data:any){
  
  return this.http.post(this.baseUrl+'/Agent/ContactUs',data,{ observe: 'response' });}
          
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
   * @param rejectionReason The reason for rejection
   * @returns Observable with the response
   */
  rejectClaim(claimId: string, rejectionReason: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Claim/${claimId}/reject?rejectionReason=${encodeURIComponent(rejectionReason)}`,
      {},
      { observe: 'response' }
    );
  }

  /**
   * Fetch policy details by policy ID.
   * @param policyId The policy ID
   * @returns Observable with the policy details
   */
  getPolicy(policyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Policy/${policyId}`, { observe: 'response' });
  }

  /**
   * Update tax percentage by tax ID.
   * @param taxId Tax ID
   * @param taxPercentage New tax percentage
   * @returns Observable with the response
   */
  updateTax(taxId: string, taxPercentage: number): Observable<any> {
    const url = `${this.baseUrl}/TaxSettings`;
    const body = {
      taxId: taxId,
      taxPercentage: taxPercentage,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(url, body, { headers });
  }

  /**
   * Fetch insurance plans with pagination.
   * @param pageNumber Current page number
   * @param pageSize Number of items per page
   * @returns Observable with the insurance plan data
   */
  getPlans(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/InsurancePlan?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      observe: 'response',
    });
  }

  /**
   * Add a new insurance plan.
   * @param planData The data for the new plan
   * @returns Observable with the response
   */
  addPlan(planData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.baseUrl}/InsurancePlan`, planData,{headers,observe: 'response'});
  }

  /**
   * Delete an insurance plan by its ID.
   * @param planId The ID of the plan to delete
   * @returns Observable with the response
   */
  deletePlan(planId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/InsurancePlan/${planId}`, { observe: 'response' });
  }
  activatePlan(planId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/InsurancePlan/activate?id=${planId}`, { observe: 'response' });
  }
updateProfile(data:any): Observable<any> {
  return this.http.put(`${this.baseUrl}/Admin/Profile`,data, { observe: 'response' });
}
  /**
   * Fetch schemes by plan ID with pagination.
   * @param planId The plan ID
   * @param page Current page number
   * @param size Number of items per page
   * @returns Observable with the scheme data
   */
  getSchemeByPlanID(planId: string, page: number, size: number): Observable<any> {
    const url = `${this.baseUrl}/InsuranceScheme/Plan/${planId}?pageNumber=${page}&pageSize=${size}`;
    return this.http.get<any>(url, { observe: 'response' });
  }
  activateScheme(schemeId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/InsuranceScheme/activate?id=${schemeId}`, { observe: 'response' });
  }

  updateScheme(scheme: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/InsuranceScheme`,scheme, { observe: 'response' });
  }

  addScheme(schemeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsuranceScheme`, schemeData);
  }
  /**
   * Delete an insurance scheme by its ID.
   * @param schemeId The ID of the scheme to delete
   * @returns Observable with the response
   */
  deleteScheme(schemeId: number): Observable<any> {
    const url = `${this.baseUrl}/InsuranceScheme/${schemeId}`;
    return this.http.delete(url);
  }

  /**
   * Fetch withdrawal requests with pagination.
   * @param pageNumber Current page number
   * @param pageSize Number of items per page
   * @returns Observable with withdrawal data
   */
  getWithdrawalRequests(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/WithdrawalRequest?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      observe: 'response',
    });
  }

  /**
   * Approve a withdrawal request by its ID.
   * @param requestId The ID of the withdrawal request to approve
   * @returns Observable with the response
   */
  approveWithdrawalRequest(requestId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/WithdrawalRequest/${requestId}/approve`, {}, { observe: 'response' });
  }

  /**
   * Reject a withdrawal request by its ID with a reason.
   * @param requestId The ID of the withdrawal request to reject
   * @param rejectionReason The reason for rejection
   * @returns Observable with the response
   */
  rejectWithdrawalRequest(requestId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/WithdrawalRequest/${requestId}/reject`, {}, { observe: 'response' });
  }

  /**
   * Get total commission by agent ID.
   * @param agentId Agent ID to fetch total commission
   * @returns Observable with total commission data
   */
  getTotalCommissionByAgent(agentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/WithdrawalRequest/agent/${agentId}/total-commission`, {
      observe: 'response',
    });
  }

  /**
   * Fetch customer details by customer ID.
   * @param customerId The customer ID
   * @returns Observable with customer details
   */
  getCustomerById(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Customer/${customerId}`, { observe: 'response' });
  }
  getEmployees(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Employee?PageNumber=${page}&PageSize=${size}`, {
      observe: 'response',
    });
  }

  /**
   * Add a new employee.
   * @param employeeData The employee data to be added
   * @returns Observable with the response
   */
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Employee`, employeeData, {
      observe: 'response',
    });
  }

  /**
   * Update an existing employee's details.
   * @param employeeData The employee data to be updated
   * @returns Observable with the response
   */
  updateEmployee(employeeData: any): Observable<any> {
    const url = `${this.baseUrl}/Employee`;
    console.log(employeeData);
    return this.http.put(url, employeeData, {
      observe: 'response',
    });
  }

  updateEmployeeSalary(id: string, salary: number): Observable<any> {
    // Construct the API URL with query parameters
    const url = `${this.baseUrl}/Employee/${id}?salary=${salary}`;
  
    console.log(`Request URL: ${url}`); // Debugging log for the constructed URL
    return this.http.put(url, null, { // Pass `null` as the body since data is in query params
      observe: 'response',
    });
  }
  
  /**
   * Delete an employee by ID.
   * @param employeeId The ID of the employee to delete
   * @returns Observable with the response
   */
  inactivateEmployee(employeeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Employee/${employeeId}`, {
      observe: 'response',
    });
  }

  activateEmployee(employeeId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/Employee/activate?id=${employeeId}`, {
      observe: 'response',
    });
  }

  getDocuments(customerId: string, page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/document/customer/${customerId}?PageNumber=${page}&PageSize=${size}`,{observe:'response'});
  }
  
  addAgent(data: any) {
    return this.http.post(this.baseUrl + "/Agent", data,{ observe: 'response' });
  }
  updateAgent(data: any) {
    return this.http.put(this.baseUrl + "/Agent", data,{ observe: 'response' });
  }
  deleteAgent(id: any) {
    return this.http.delete(this.baseUrl + "/Agent/" + id, { observe: 'response' });
  }
  getFilterAgents(pgNo: number = 1, pgSize: number = 5): Observable<any> {
    const searchUrl = `${this.baseUrl}/Agent?PageNumber=${pgNo}&PageSize=${pgSize}`;
    return this.http.get(searchUrl, { observe: 'response' });
  }
  activateAgent(agentId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/Agent/activate?id=${agentId}`, { observe: 'response' });
  }

  getDocumentTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Document/types`, { observe:'response' });
  }
 
  uploadDocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Ensure 'file' matches the backend's expected parameter

    return this.http.post(`${this.backendUrl}/upload`, formData); // Correct endpoint
  }

  saveMetadataToBackend(metadata: any): Observable<any> {
    return this.http.post(this. backendUrl, metadata);
  }
  updateDocument(updatedDocument: any): Observable<any> {
    return this.http.put(`${this.backendUrl}`,updatedDocument);
  } 
  payments(page: number, size: number): Observable<any> {
  
    return this.http.get(`${this.baseUrl}/Payment?PageNumber=${page}&PageSize=${size}`, { observe:'response' });
  }
  // getTotalCommissionByAgent(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/WithdrawalRequest/agent/${id}/total-commission`, { observe:'response' });
  // }
 
  getTax():Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.baseUrl}/TaxSettings`);
  }
  getPlanById(planId:any):Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl}/InsurancePlan/${planId}`);
  }
  
}
