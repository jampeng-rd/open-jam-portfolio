import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../Portfolio/services/portfolio-service';
import { PortFolio } from '../../../Portfolio/models/portfolio.model';

@Component({
  selector: 'app-portfolios-page',
  imports: [RouterLink],
  templateUrl: './portfolios-page.html',
  styleUrl: './portfolios-page.css',
})
export class PortfoliosPage implements OnInit {
  private portfolioService = inject(PortfolioService);

  readonly portFolios = signal<PortFolio[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadPortfolios();
  }

  private loadPortfolios(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.portfolioService.getAllPortfolio()
    .subscribe({
      next: (response) => {
        const visiblePortfolios = response
        .filter(portfolio => portfolio.isVisible);

        this.portFolios.set(visiblePortfolios);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('伺服器尚未連線');
        this.isLoading.set(false);
      },
    });
  }
}
