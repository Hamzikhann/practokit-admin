import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  baseUrl: string = environment.reqBaseUrl;
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  getFileSafeUrl(payload: any) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }
}
