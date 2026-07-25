import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PortfolioService } from '../../../Portfolio/services/portfolio-service';
import { PortFolio } from '../../../Portfolio/models/portfolio.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-section',
  imports: [RouterLink],
  templateUrl: './portfolio-section.html',
  styleUrl: './portfolio-section.css',
})
export class PortfolioSection implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);

  readonly portFolios = signal<PortFolio[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  readonly currentSlideIndex = signal(0);

  // 從 currentSlideIndex 開始循環取得三個作品。
  readonly visiblePortfolios = computed(() => {
    const portfolios = this.portFolios();
    const total = portfolios.length;

    if (total === 0) { return [] }

    const displayCount = Math.min(3, total);
    const startIndex = this.currentSlideIndex();

    return Array.from(
      { length: displayCount },
      (_, offset) => {
        const portfolioIndex = (startIndex + offset) % total;

        return portfolios[portfolioIndex];
      }
    );
  });

  ngOnInit(): void {
    this.loadPortfolios();
  }

  // 元件離開頁面時關閉計時器
  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // 切到下一張
  nextSlide(isManual = false): void {
    const total = this.portFolios().length;

    if (total <= 1) return;

    this.currentSlideIndex.update(
      currentIndex => (currentIndex + 1) % total
    );

    if (isManual) {
      this.restartAutoplay();
    }
  }

  // 切到上一張
  previousSlide(isManual = false): void {
    const total = this.portFolios().length;

    if (total <= 1) return;

    this.currentSlideIndex.update(
      currentIndex => currentIndex === 0
          ? total - 1
          : currentIndex - 1
    );

    if (isManual) this.restartAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.restartAutoplay();
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  private startAutoplay(): void {
    this.stopAutoplay();

    if (this.portFolios().length <= 1) {
      return;
    }

    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer === null) {
      return;
    }

    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // 取 5 筆作品 - 可以根據更改參數取回特定筆數
  private loadPortfolios(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.portfolioService.getHomePortfolios(5)
    .subscribe({
      next: (response) => {
        this.portFolios.set(response);
        this.currentSlideIndex.set(response.length-1);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('伺服器尚未連線');
        this.isLoading.set(false);
      },
    });
  }

}
