import { Component } from '@angular/core';
import { ProfileSection } from '../../components/profile-section/profile-section';
import { PortfolioSection } from '../../components/portfolio-section/portfolio-section';

@Component({
  selector: 'app-home-page',
  imports: [ProfileSection, PortfolioSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
