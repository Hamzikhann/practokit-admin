import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl: string = environment.reqBaseUrl + 'dashboard/';

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getEditorDashboard(editorId: string) {
    return this.http.get(this.baseUrl + 'editor/' + editorId, {
      observe: 'response',
    });
  }

  getTeacherDashboard(teacherId: string) {
    return this.http.get(this.baseUrl + 'teacher/' + teacherId, {
      observe: 'response',
    });
  }
}
