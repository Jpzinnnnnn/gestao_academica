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

  // 🦸 CREATE HERO
  createHero(hero: any) {
    return this.http.post(`${this.url}/heroes`, hero);
  }

  // 📋 LIST
  getHeroes() {
    return this.http.get(`${this.url}/heroes`);
  }

  // ✏️ UPDATE
  updateHero(id: number, hero: any) {
    return this.http.put(`${this.url}/heroes/${id}`, hero);
  }

  // ❌ DELETE
  deleteHero(id: number) {
    return this.http.delete(`${this.url}/heroes/${id}`);
  }
}
