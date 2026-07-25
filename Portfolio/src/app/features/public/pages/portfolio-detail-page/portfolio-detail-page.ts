import { Component, computed, inject, input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { PortfolioService } from '../../../Portfolio/services/portfolio-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-portfolio-detail-page',
  imports: [MarkdownComponent],
  templateUrl: './portfolio-detail-page.html',
  styleUrl: './portfolio-detail-page.css',
})
export class PortfolioDetailPage {
  // 取得這個詳細頁面路由的 :url 參數
  url = input<string | undefined>();
  private readonly portfolioService = inject(PortfolioService);

  private readonly  portfolioResourceRef = this.portfolioService.getPortfolioByUrlHandle(this.url);
  
  isLoading = this.portfolioResourceRef.isLoading;
  portfolioResponse = this.portfolioResourceRef.value;

  private readonly errorResponse = this.portfolioResourceRef.error;
  errorMessage = computed(() => {
    const error = this.errorResponse();

    if (!error) {
      return null;
    }

    if (error instanceof HttpErrorResponse) {
      // 無法連線、CORS、後端沒有啟動等網路錯誤
      if (error.status === 0) {
        return '無法連線到伺服器，請稍後再試。';
      }

      // 後端回傳：
      // { "message": "找不到指定的作品。" }
      if (
        typeof error.error === 'object' &&
        error.error !== null &&
        'message' in error.error &&
        typeof error.error.message === 'string'
      ) {
        return error.error.message;
      }

      // 後端直接回傳純文字
      if (typeof error.error === 'string') {
        return error.error;
      }

      // 依狀態碼顯示較友善的文字
      if (error.status === 404) {
        return '找不到這個專案。';
      }

      if (error.status === 500) {
        return '伺服器發生錯誤，請稍後再試。';
      }

      return error.message || '讀取專案資料失敗。';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return '讀取專案資料失敗。';
  });
  
}
