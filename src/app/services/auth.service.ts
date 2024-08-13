import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environement } from '../environement/environement';
 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environement.apiUrl;  
  private tokenKey = 'authToken';  

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/signup`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/user/login`, credentials, { headers });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);  // Temps actuel en secondes
    return payload.exp > now;  // Vérifie si le token n'est pas expiré
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);  // Utilisation de jwt-decode pour décoder le token
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  setToken(token: string): void {
    this.saveToken(token);  // Utilise saveToken pour stocker le token
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

