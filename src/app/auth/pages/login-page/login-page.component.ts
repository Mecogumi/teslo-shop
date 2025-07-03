import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  fb = inject(FormBuilder)
  hasError = signal(false)
  isPosting = signal(false)
  authService = inject(AuthService)
  router = inject(Router)

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSumbit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true)
      return
    }
    const { email = '', password = '' } = this.loginForm.value

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/')
        return
      }
      this.hasError.set(true)
    })
  }
}
