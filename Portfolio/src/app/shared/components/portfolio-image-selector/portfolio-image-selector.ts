import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioImageService } from '../../services/portfolio-image-service';
import { PortfolioImage } from '../../models/image.model';

@Component({
  selector: 'app-portfolio-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './portfolio-image-selector.html',
  styleUrl: './portfolio-image-selector.css',
})
export class PortfolioImageSelector {
  private imageSelectorService = inject(PortfolioImageService);

  // 只用來通知 httpResource 重新取得圖片
  refreshTrigger = signal(0);

  // 取得 imageSelectorService 中設定的 showImageSelector 的預設狀態"false" 關閉照片視窗
  showImageSelector = this.imageSelectorService.showImageSelector;

  // Call Service 取得所有照片
  private getAllPortfolioImagesRef = this.imageSelectorService.getAllPortfolioImages(this.refreshTrigger);
  isLoading = this.getAllPortfolioImagesRef.isLoading
  response = this.getAllPortfolioImagesRef.value;

  // Form Group
  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null>(null,{
      validators: [Validators.required],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });


  hideImageSelector() {
    this.imageSelectorService.hideImageSelector();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // 綁定 Form 表單的照片 input
    this.imageSelectorUploadForm.patchValue({
      file: file,
    });    
  }

  onSelectImage(image: PortfolioImage) {
    this.imageSelectorService.selectImage(image.url);
  }

  onSubmit() {
    if (this.imageSelectorUploadForm.invalid) {
      this.imageSelectorUploadForm.markAllAsTouched();
      return;
    }

    const formRawValue = this.imageSelectorUploadForm.getRawValue();
    
    if (!formRawValue.file) {
      return;
    }

    // Call Service API
    this.imageSelectorService.uploadImage(formRawValue.file, formRawValue.name)
    .subscribe({
      next: () => {
        // 上傳成功後重新取得全部圖片
        this.refreshTrigger.update(value => value + 1);

        this.imageSelectorUploadForm.reset();
      },
      error: () => {
        console.error('上傳照片失敗');
      },
    });
  }

  onDelete(image: PortfolioImage) {
    const confirmed = window.confirm(`確定要刪除圖片「${image.fileName}」嗎？`);

    if (!confirmed) {
      return;
    }

    this.imageSelectorService.deleteImage(image.id)
    .subscribe({
      next: () => {
        // 刪除成功後重新取得全部圖片
        this.refreshTrigger.update(value => value + 1);

        console.log('圖片刪除成功');
      },
      error: error => {
        console.error('圖片刪除失敗', error);
      },
    });
  }
}
