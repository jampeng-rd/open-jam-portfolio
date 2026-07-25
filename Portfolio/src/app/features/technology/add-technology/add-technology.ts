import { Component, inject } from '@angular/core';
import { TechnologyService } from '../services/technology-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTechnologyRequest } from '../models/technology.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-technology',
  imports: [ReactiveFormsModule],
  templateUrl: './add-technology.html',
  styleUrl: './add-technology.css',
})
export class AddTechnology {
  private router = inject(Router);
  private technologyServices = inject(TechnologyService);

  // Form Group
  addTechnologyFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    iconUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(2000)],
    }),
  });

  get nameFormControl() {
    return this.addTechnologyFormGroup.controls.name;
  }

  get iconUrlFormControl() {
    return this.addTechnologyFormGroup.controls.iconUrl;
  }

  onSubmit() {
    const formRawValue = this.addTechnologyFormGroup.getRawValue();

    const addTechnlogyRequest: AddTechnologyRequest = {
      name: formRawValue.name,
      iconUrl: formRawValue.iconUrl,
    };

    this.technologyServices.addTechnology(addTechnlogyRequest)
    .subscribe({
      next:(response) => {
        // console.log('新增成功', response);
        this.router.navigate(['/admin', 'technologys'])
      },
      error: (error) => {
        console.error('新增失敗', error);
      },  
    });
  }
}
