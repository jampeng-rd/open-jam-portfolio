import { Component, inject, OnInit, signal } from '@angular/core';
import { TechnologyService } from '../services/technology-service';
import { RouterLink } from '@angular/router';
import { Technology } from '../models/technology.model';

@Component({
  selector: 'app-technology-list',
  imports: [RouterLink],
  templateUrl: './technology-list.html',
  styleUrl: './technology-list.css',
})
export class TechnologyList implements OnInit {
  private technologyService = inject(TechnologyService);

  technologies = signal<Technology[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTechnologies();
  }

  private loadTechnologies(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.technologyService.getAllTechnologies()
    .subscribe({
      next: (response) => {
        // console.log(response)
        this.technologies.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        // console.error('取得技能列表失敗', error);
        this.errorMessage.set('取得技能列表失敗');
        this.isLoading.set(false);
      },
    });
  }
   
}
