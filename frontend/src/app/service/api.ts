import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // 🔐 REGISTER
  register(data: any) {
    return this.http.post(`${this.url}/register`, data);
  }

  // 🔑 LOGIN
  login(data: any) {
    return this.http.post(`${this.url}/login`, data);
  }

  getUser(id: number) {
    return this.http.get(`${this.url}/user/${id}`);
  }
}
