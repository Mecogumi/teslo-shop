import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  fb = inject(FormBuilder)
  router = inject(Router)
  authService = inject(AuthService)

  hasError = signal(false)
  isPosting = signal(false)

  registerForm = this.fb.group({
    fullName: ['', Validators.required,],
    email: ['', [Validators.required, Validators.email],],
    password: ['', [Validators.required, Validators.minLength(6)],]
  })
  onSumbit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true)
      return
    }
    const { fullName = "", email = "", password = "" } = this.registerForm.value
    this.authService.register(fullName!, email!, password!).subscribe((isValidated) => {
      if (isValidated) {
        this.router.navigateByUrl('/')
        return
      }
      this.hasError.set(true)
    })
  }
}
