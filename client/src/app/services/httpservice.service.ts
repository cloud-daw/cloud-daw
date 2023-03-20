import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  endpoint: string = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}
  getStatus(): Observable<any> {
    return this.http.get<any>(this.endpoint);
  }
}
