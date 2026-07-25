import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AddPortFolioRequest, PortFolio, UpdatePortFolioRequest } from '../models/portfolio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  
  addPortfolio(portfolio: AddPortFolioRequest): Observable<PortFolio> {
    return this.http.post<PortFolio>(`${this.apiBaseUrl}/api/portfolio`, portfolio);
  }

  getAllPortfolio(): Observable<PortFolio[]> {
    return this.http.get<PortFolio[]>(`${this.apiBaseUrl}/api/portfolio`);
  }

  // 首頁專用限制顯示作品數量
  getHomePortfolios(count: number = 5): Observable<PortFolio[]> {
      return this.http.get<PortFolio[]>(`${this.apiBaseUrl}/api/portfolio/home-preview`, {
        params: {
          count,
        },
      })
  }

  getPortfolioById(id: InputSignal<string | undefined>): HttpResourceRef<PortFolio | undefined> {
    return httpResource<PortFolio>(() => `${this.apiBaseUrl}/api/portfolio/${id()}`);
  }

  updatePortfolio(id: string, updatePortfolio: UpdatePortFolioRequest): Observable<PortFolio> {
    return this.http.put<PortFolio>(`${this.apiBaseUrl}/api/portfolio/${id}`, updatePortfolio);
  }

  deletePortfolioById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/portfolio/${id}`);
  }

  getPortfolioByUrlHandle(url: InputSignal<string | undefined>): HttpResourceRef<PortFolio | undefined> {
    // return httpResource<PortFolio>(() => `${this.apiBaseUrl}/api/portfolio/${url()}`);

    return httpResource<PortFolio>(() => {
      const urlHandle = url();

      if (!urlHandle) {
        return undefined;
      }

      return `${this.apiBaseUrl}/api/portfolio/${encodeURIComponent(urlHandle)}`;
    });
  }

}
