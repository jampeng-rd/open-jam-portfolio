import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { PortfolioService } from '../services/portfolio-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyService } from '../../technology/services/technology-service';
import { Router } from '@angular/router';
import { Technology } from '../../technology/models/technology.model';
import { AddPortFolioRequest } from '../models/portfolio.model';
import { MarkdownComponent } from 'ngx-markdown';
import { PortfolioImageService } from '../../../shared/services/portfolio-image-service';

@Component({
  selector: 'app-add-portfolio',
  imports: [ReactiveFormsModule, MarkdownComponent],
  templateUrl: './add-portfolio.html',
  styleUrl: './add-portfolio.css',
})
export class AddPortfolio implements OnInit {
  private portfolioService = inject(PortfolioService);
  private technologyService = inject(TechnologyService);
  private imageSelectorService = inject(PortfolioImageService);
  private router = inject(Router);

  // Call TechnologyService 取所有技能
  technologies = signal<Technology[]>([]);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTechnologies();
  }

  private loadTechnologies(): void {
    this.errorMessage.set('');

    this.technologyService.getAllTechnologies()
    .subscribe({
      next: (response) => {
        this.technologies.set(response);
      },
      error: (error) => {
        console.error('取得技能列表失敗', error);
        this.errorMessage.set('取得技能列表失敗');
      },
    });
  }

  // Form Group
  addPortfolioFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    imageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2048)],
    }),
    gitHubUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    gitLabUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    demoUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    videoUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(2048)],
    }),
    pdfUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(2048)],
    }),
    isVisible: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    technologies: new FormControl<string[]>([]),
  });

  get nameFormControl() {
    return this.addPortfolioFormGroup.controls.name;
  }

  get shortDescriptionFormControl() {
    return this.addPortfolioFormGroup.controls.shortDescription;
  }

  get descriptionFormControl() {
    return this.addPortfolioFormGroup.controls.description;
  }

  get imageUrlFormControl() {
    return this.addPortfolioFormGroup.controls.imageUrl;
  }

  // 取得 imageSelectorService 中被改變的照片 URL 值 -> 掛載到 Form 的 ImageUrl Input 中
  selectedImageEffectRef = effect(() =>{
    const selectedImageUrl = this.imageSelectorService.selectedImage();
    if (selectedImageUrl) {
      this.addPortfolioFormGroup.patchValue({
        imageUrl: selectedImageUrl,
      })
    }
  })

  onSubmit() {
    const formRawValue = this.addPortfolioFormGroup.getRawValue();

    const portfolio: AddPortFolioRequest = {
      name: formRawValue.name,
      shortDescription: formRawValue.shortDescription,
      description: formRawValue.description,
      imageUrl: formRawValue.imageUrl,
      gitHubUrl: formRawValue.gitHubUrl,
      gitLabUrl: formRawValue.gitLabUrl,
      demoUrl: formRawValue.demoUrl,
      videoUrl: formRawValue.videoUrl,
      pdfUrl: formRawValue.pdfUrl,
      isVisible: formRawValue.isVisible,
      technologies: formRawValue.technologies ?? [],
    };

    this.portfolioService.addPortfolio(portfolio)
    .subscribe({
      next: (response) => {
        // console.log('新增成功', response);
        this.router.navigate(['/admin', 'portfolios'])
      },
      error: (error) => {
        console.error('新增失敗', error);
      },
    });
  }

  openImageSelector () {
    this.imageSelectorService.displayImageSelector();
  }

}
