import { Component, effect, inject, input } from '@angular/core';
import { TechnologyService } from '../services/technology-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateTechnologyRequest } from '../models/technology.model';

@Component({
  selector: 'app-edit-technology',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-technology.html',
  styleUrl: './edit-technology.css',
})
export class EditTechnology {
  id = input<string>();
  private technologyService = inject(TechnologyService);
  private router = inject(Router);
  
  // Retrieve One data of Technology by Id
  technologyResourceRef = this.technologyService.getTechnologyById(this.id);
  technologyResponse = this.technologyResourceRef.value;

  // Form Group
  editTechnologyFormGroup = new FormGroup({
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
    return this.editTechnologyFormGroup.controls.name;
  }

  get iconUrlFormControl() {
    return this.editTechnologyFormGroup.controls.iconUrl;
  }

  effectRef = effect(()=>{
    if (this.technologyResponse()) {
      this.editTechnologyFormGroup.patchValue({
        name: this.technologyResponse()?.name,
        iconUrl: this.technologyResponse()?.iconUrl,
      });
    }
  })

  onSubmit() {
    const formRawValue = this.editTechnologyFormGroup.getRawValue();
    const id = this.id();

    if(!this.editTechnologyFormGroup.valid || !id) {
      return;
    }

    const updateTechnology: UpdateTechnologyRequest = {
      name: formRawValue.name,
      iconUrl: formRawValue.iconUrl,
    };

    // Call Service
    this.technologyService.updateTechnology(id, updateTechnology)
    .subscribe({
      next: (response) => {
        // console.log('更新成功', response);
        this.router.navigate(['/admin', 'technologys'])
      },
      error: (error) => {
        console.error('更新失敗', error);
      },
    });
  }

  deleteTechnology() {
    const id = this.id();
    if (!id) return;

    this.technologyService.deleteTechnologyById(id)
    .subscribe({
      next: () => {
        this.router.navigate(['/admin', 'technologys']);
      },
      error: (error) => {
        console.error('刪除失敗', error);
      },
    });
  }
}
