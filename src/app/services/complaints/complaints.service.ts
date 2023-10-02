import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  baseUrl: string = environment.reqBaseUrl + 'problems/';

  constructor(private http: HttpClient) {}

  getAllComplaints() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  updateStatus(complaintId: string, payload: { status: any }) {
    return this.http.post(
      this.baseUrl + complaintId + '/status/update',
      payload,
      {
        observe: 'response',
      }
    );
  }
}
