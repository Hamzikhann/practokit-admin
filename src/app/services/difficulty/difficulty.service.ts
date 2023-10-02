import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  baseUrl: string = environment.reqBaseUrl + "questionDifficulties/";

  constructor(
    private http: HttpClient,
  ) {}

  getAllDifficulties() {
    return this.http.get(this.baseUrl, {
      observe: "response",
    });
  }
}
