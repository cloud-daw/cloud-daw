import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// BASE SERVICE FOR HTTP CALLS, CALLED BY OTHER SERVICES

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})

/**
 * Generic service to harness in specific services
 */
export class ApiHttpService {
  endpoint: string = 'http://localhost:8080/api/';
  constructor(private http: HttpClient) {
  }
  /**
   * Gets data according to api endpoint & type
   * 
   * Type "T" is generic, see recording service for example usage
   * @param api name of api route to call, e.g. 'recording'
   * @returns relevant data from api of given type
   */
  get<T>(api : string): Observable<T> {
    return this.http.get<T>(this.endpoint + api);
  }
  post<T>(api: string, params: any): Observable<T> {
    return this.http.post<T>(this.endpoint + api, params);
  }
}
