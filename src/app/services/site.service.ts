import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environement } from '../environement/environement';

const token = localStorage.getItem('authToken');

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private baseUrl = environement.apiUrl;

  constructor(private http: HttpClient) {}

  
  
  

  getAllSites(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/site/getall`).pipe(
      catchError(this.handleError)
    );
  }

  getSitesLastMesure(): Observable<any> {
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });;
    return this.http.get<any>(`${this.baseUrl}/mesure/getlasts`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = ' Service indisponible!';
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Error: ${error.error.message}`;
    } else {
      
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  createSite(site: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/site/add`,site);
    
  }


  getSiteById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);

  }

}

