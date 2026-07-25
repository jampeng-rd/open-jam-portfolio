import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PortfolioImage } from '../models/image.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioImageService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  readonly showImageSelector = signal<boolean>(false);
  selectedImage = signal<string | null>(null);

  displayImageSelector() {
    this.showImageSelector.set(true);
  }

  hideImageSelector() {
    this.showImageSelector.set(false);
  }

  selectImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
    this.hideImageSelector();
  }

  uploadImage(file: File, filename: string): Observable<PortfolioImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', filename);

    return this.http.post<PortfolioImage>(`${this.apiBaseUrl}/api/image`, formData);
  }

  getAllPortfolioImages(refreshTrigger: WritableSignal<number>): HttpResourceRef<PortfolioImage[] | undefined> {
    return httpResource<PortfolioImage[]>(() => {
      // 讀取 signal，當 signal 改變時重新呼叫 API
      refreshTrigger();
      return `${this.apiBaseUrl}/api/image`;
    });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/image/${id}`);
  }
}
