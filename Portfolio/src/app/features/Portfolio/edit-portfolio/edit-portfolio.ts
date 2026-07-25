import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { PortfolioService } from '../services/portfolio-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyService } from '../../technology/services/technology-service';
import { Router } from '@angular/router';
import { Technology } from '../../technology/models/technology.model';
import { MarkdownComponent } from 'ngx-markdown';
import { UpdatePortFolioRequest } from '../models/portfolio.model';
import { PortfolioImageService } from '../../../shared/services/portfolio-image-service';

@Component({
  selector: 'app-edit-portfolio',
  imports: [ReactiveFormsModule, MarkdownComponent],
  templateUrl: './edit-portfolio.html',
  styleUrl: './edit-portfolio.css',
})
export class EditPortfolio implements OnInit {
  id = input<string>();
  private portfolioService = inject(PortfolioService);
  private technologyService = inject(TechnologyService);
  private imageSelectorService = inject(PortfolioImageService);
  private router = inject(Router);

  // Retrieve One data of portfolio by Id
  portfolioResourceRef = this.portfolioService.getPortfolioById(this.id)
  portfolioResponse = this.portfolioResourceRef.value;

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
        // console.error('取得技能列表失敗', error);
        this.errorMessage.set('取得技能列表失敗');
      },
    });
  }

  // Form Group
  editPortfolioFormGroup = new FormGroup({
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
    return this.editPortfolioFormGroup.controls.name;
  }

  get shortDescriptionFormControl() {
    return this.editPortfolioFormGroup.controls.shortDescription;
  }

  get descriptionFormControl() {
    return this.editPortfolioFormGroup.controls.description;
  }

  get imageUrlFormControl() {
    return this.editPortfolioFormGroup.controls.imageUrl;
  }

  effectRef = effect(()=>{
    if (this.portfolioResponse()) {
      this.editPortfolioFormGroup.patchValue({
        name: this.portfolioResponse()?.name,
        shortDescription: this.portfolioResponse()?.shortDescription,
        description: this.portfolioResponse()?.description,
        imageUrl: this.portfolioResponse()?.imageUrl,
        gitHubUrl: this.portfolioResponse()?.gitHubUrl,
        gitLabUrl: this.portfolioResponse()?.gitLabUrl,
        demoUrl: this.portfolioResponse()?.demoUrl,
        videoUrl: this.portfolioResponse()?.videoUrl,
        pdfUrl: this.portfolioResponse()?.pdfUrl,
        isVisible: this.portfolioResponse()?.isVisible,
        technologies: this.portfolioResponse()?.technologies.map(x => x.id),
      });
    }
  })

  // 取得 imageSelectorService 中被改變的照片 URL 值 -> 掛載到 Form 的 ImageUrl Input 中
  selectedImageEffectRef = effect(() =>{
    const selectedImageUrl = this.imageSelectorService.selectedImage();
    if (selectedImageUrl) {
      this.editPortfolioFormGroup.patchValue({
        imageUrl: selectedImageUrl,
      })
    }
  })

  onSubmit() {
    const formRawValue = this.editPortfolioFormGroup.getRawValue();
    const id = this.id();

    if(!this.editPortfolioFormGroup.valid || !id) {
      return;
    }

    const portfolio: UpdatePortFolioRequest = {
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

    this.portfolioService.updatePortfolio(id, portfolio)
    .subscribe({
      next: () => {
        this.router.navigate(['/admin', 'portfolios'])
      },
      error: (error) => {
        console.error('更新失敗', error);
      },
    });
  }

  onDelete() {
    const id = this.id();
    if (!id) return;

    this.portfolioService.deletePortfolioById(id)
    .subscribe({
      next: () => {
        this.router.navigate(['/admin', 'portfolios']);
      },
      error: (error) => {
        console.error('刪除失敗', error);
      },
    });
  }

  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }

}
