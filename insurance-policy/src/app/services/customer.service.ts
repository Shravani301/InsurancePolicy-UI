import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  isCustomerAssociatedWithScheme(schemeId: number, customerId: number): Observable<{ IsAssociated: boolean }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.get<{ IsAssociated: boolean }>(
      `${this.apiUrl}/InsuranceScheme/${schemeId}/customer/${customerId}/exists`,
      { headers }
    );
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
    return this.http.get<any>(`${this.apiUrl}/schemes/${schemeId}`);
  }

  // Get detailed scheme information
  getDetail(schemeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schemes/details/${schemeId}`);
  }

  // Get tax percentage
  getTaxPercent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tax`);
  }

  // Register a claim
  registerCliam(claim: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/claims`, claim);
  }

  // Make a payment
  makePayment(payment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments`, payment);
  } 
  
  // Upload file to Cloudinary
  uploadToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'customer_documents'); // Replace with your preset name
  
    return this.http.post(this.cloudinaryUrl, formData, {
      headers: new HttpHeaders({}),
    });
  }
  
  
  

  // Save document metadata to backend
  saveMetadataToBackend(metadata: any): Observable<any> {
    return this.http.post(this.backendUrl, metadata);
  }


  // Upload document combining Cloudinary and backend logic
  // uploadDocument(file: File, customerId: string, docType: string): Observable<any> {
  //   return this.uploadToCloudinary(file).pipe(
  //     switchMap((cloudinaryResponse: any) => {
  //       const metadata = {
  //         documentName: docType,
  //         documentPath: cloudinaryResponse.secure_url,
  //         customerId: customerId,
  //       };
  //       return this.saveMetadataToBackend(metadata);
  //     })
  //   );
  // }
   // Download document by document ID
   downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.backendUrl}/${documentId}`, { responseType: 'blob' });
  }
}
