import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize} from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LoginRequest } from '../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly loginError = signal<string | null>(null);

  // Form Group
  readonly loginFormGroup = new FormGroup({
    userName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get userNameFormControl() {
    return this.loginFormGroup.controls.userName;
  }

  get passwordFormControl() {
    return this.loginFormGroup.controls.password;
  }
  
  onSubmit(): void {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.loginError.set(null);
    this.isSubmitting.set(true);

    const loginRequest: LoginRequest = this.loginFormGroup.getRawValue();

    this.authService.login(loginRequest)
    .pipe(
      finalize(() => { this.isSubmitting.set(false) })
    )
    .subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        this.router.navigateByUrl(returnUrl || '/');
      },
      error: (error) => {
        if (error.status === 401) {
          this.loginError.set('帳號或密碼錯誤');
          return;
        }

        this.loginError.set('登入時發生錯誤，請稍後再試');
      },
    });
  }

}
