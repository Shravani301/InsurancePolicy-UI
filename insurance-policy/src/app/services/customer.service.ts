import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7052/api'; // Replace with your actual API URL
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dad8bwxk8/auto/upload';
  private backendUrl = 'https://localhost:7052/api/Document';

  constructor(private http: HttpClient) {}

  getPolicies(userId: string, pageNumber: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    const url = `https://localhost:7052/api/Policy/customer/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get<any>(url, { headers, observe: 'response' });
  }
  getPoliciesByCustomerId(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    const url = `https://localhost:7052/api/Policy/customerId/${userId}`;
    return this.http.get<any>(url, { headers, observe: 'response' });
  }
  getPoliciesPendingAll(pageNumber: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    const url = `https://localhost:7052/api/Policy/pending?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get<any>(url, { headers, observe: 'response' });
  }
  getPoliciesActive(userId: string, pageNumber: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    const url = `https://localhost:7052/api/Policy/customer/active/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get<any>(url, { headers, observe: 'response' });
  }
  getPoliciesPendingByCustomer(userId: string, pageNumber: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    const url = `https://localhost:7052/api/Policy/customer/pending/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get<any>(url, { headers, observe: 'response' });
  }

  updateCustomerProfile(data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Customer/Profile`,data, { observe: 'response' });
  }

  
  isCustomerAssociatedWithScheme(schemeId: number, customerId: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.get<any>(
      `${this.apiUrl}/InsuranceScheme/${schemeId}/customer/${customerId}/exists`,
      { headers, observe: 'response' });
  }  
  
  getCustomerProfile(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token-based authentication
    });
  
    // API call with the provided `id`
    return this.http.get<any>(`${this.apiUrl}/customer/${id}`, { observe: 'response' });
  }  
  getFilterAgentsByCustomer(page: number, pageSize: number, customerId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token-based authentication
    });
  
    return this.http.get<any>(`${this.apiUrl}/Agent/customer/${customerId}?page=${page}&pageSize=${pageSize}`, {
      headers,
      observe: 'response',
    });
  }
  getComplaints(page: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token-based authentication
    });
  
    const url = `${this.apiUrl}/CustomerQuery?PageNumber=${page}&PageSize=${pageSize}`;
  
    return this.http.get<any>(url, { headers, observe: 'response' });
  }
  
  
  getComplaintsByCustomerId(userId: string, pageNumber: number, pageSize: number): Observable<any> {
    const url = `https://localhost:7052/api/CustomerQuery/customer/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  
  reuploadDocument(documentId: string, newUrl: string) {
    return this.http.put(`${this.apiUrl}/Document/reupload?id=${documentId}&url=${newUrl}`, {});
  }
  
  addComplaint(complaint: { title: string; message: string; customerId: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${this.apiUrl}/CustomerQuery`, complaint, { headers });
  }
  // Get policy details by policy number
  getPolicyDetail(policyNo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Policy/${policyNo}`);
  }

  // Get scheme details by scheme ID
  getSchemeById(schemeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/InsuranceScheme/${schemeId}`);
  }


  // Get detailed scheme information
  getDetail(schemeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schemes/details/${schemeId}`);
  }

  // Get tax percentage
  getTaxPercent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/TaxSettings`);
  }

  // Register a claim
  registerCliam(claim: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/claims`, claim);
  }

  // Make a payment
  makePayment(payment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Payment`, payment);
  } 
  getDocumentTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/types`);
  }

  getDocuments(customerId: string, role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this. backendUrl}/${customerId}/${role}`);
  }

  uploadToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'customer_documents');

    return this.http.post('https://api.cloudinary.com/v1_1/dad8bwxk8/auto/upload', formData);
  }

  saveMetadataToBackend(metadata: any): Observable<any> {
    return this.http.post(this. backendUrl, metadata);
  }
  updateDocument(updatedDocument: any): Observable<any> {
    return this.http.post(this. backendUrl,updatedDocument);
  } 
  
  uploadDocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Ensure 'file' matches the backend's expected parameter

    return this.http.post(`${this.backendUrl}/upload`, formData); // Correct endpoint
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${documentId}`, { responseType: 'blob' });
  }
  getPolicy(policyId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Policy/${policyId}`);
  }

  // Method to purchase/apply for a policy
  purchasePolicy(policy: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Policy`, policy);
  }

  
  getAgents(pgNo: number = 1, pgSize: number = 5): Observable<any> {
    const searchUrl = `${this.apiUrl}/Agent?PageNumber=${pgNo}&PageSize=${pgSize}`;
    return this.http.get(searchUrl, { observe: 'response' });
  }
  

  getAgentById(agentId:any): Observable<any> {
    const searchUrl = `${this.apiUrl}/Agent/${agentId}`;
    return this.http.get(searchUrl, { observe: 'response' });
  }

  getClaimsByCustomerId(customerId: string, pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrl}/Claim/customer/${customerId}/?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get(url, {
      observe: 'response',
    });
  }  
  getInstallmentsById(policyId: string, pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrl}/Installment/policy/${policyId}/?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return this.http.get(url, {
      observe: 'response',
    });
  }  
  updateInstallment(installment:any): Observable<any> {
    const url = `${this.apiUrl}/Installment`;
    return this.http.put(url,installment, {
      observe: 'response',
    });
  }  
  addClaim(requset:any): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      });
  
      return this.http.post<any>(`${this.apiUrl}/Claim`, requset, { headers });
  }
}
