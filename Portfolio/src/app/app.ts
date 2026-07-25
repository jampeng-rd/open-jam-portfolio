import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { PortfolioImageSelector } from './shared/components/portfolio-image-selector/portfolio-image-selector';
import { Footer } from './core/components/footer/footer';
import { AuthService } from './features/auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, PortfolioImageSelector, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio');

  private readonly authService = inject(AuthService);
  
  ngOnInit(): void {
    this.authService.initializeAuth().subscribe();
  }

}
