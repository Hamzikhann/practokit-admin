import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl: string = environment.reqBaseUrl + "roles/";

  constructor(
    private http: HttpClient
  ) { }
  
  getAllRoles() {
    return this.http.get(this.baseUrl, {
      observe: "response",
    });
  }
}
