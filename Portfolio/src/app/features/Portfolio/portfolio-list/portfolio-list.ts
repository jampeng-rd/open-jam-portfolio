import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../services/portfolio-service';
import { PortFolio } from '../models/portfolio.model';

@Component({
  selector: 'app-portfolio-list',
  imports: [RouterLink],
  templateUrl: './portfolio-list.html',
  styleUrl: './portfolio-list.css',
})
export class PortfolioList implements OnInit {
  private portfolioService = inject(PortfolioService);

  portFolios = signal<PortFolio[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTechnologies();
  }

  private loadTechnologies(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.portfolioService.getAllPortfolio()
    .subscribe({
      next: (response) => {
        // console.log(response)
        this.portFolios.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        // console.error('取得專案列表失敗', error);
        this.errorMessage.set('取得專案列表失敗');
        this.isLoading.set(false);
      },
    });
  }
}
