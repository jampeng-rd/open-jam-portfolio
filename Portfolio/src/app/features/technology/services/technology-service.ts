import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AddTechnologyRequest, Technology, UpdateTechnologyRequest } from '../models/technology.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  addTechnology(addTechnlogyRequest: AddTechnologyRequest): Observable<Technology> {
    return this.http.post<Technology>(`${this.apiBaseUrl}/api/technology`, addTechnlogyRequest);
  }

  getAllTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.apiBaseUrl}/api/technology`);
  }
  
  getTechnologyById(id: InputSignal<string | undefined>): HttpResourceRef<Technology | undefined> {
    return httpResource<Technology>(() => `${this.apiBaseUrl}/api/technology/${id()}`);
  }
  
  updateTechnology(id: string, updateTechnology: UpdateTechnologyRequest): Observable<Technology> {
    return this.http.put<Technology>(`${this.apiBaseUrl}/api/technology/${id}`, updateTechnology);
  }

  deleteTechnologyById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/technology/${id}`);
  }

}
