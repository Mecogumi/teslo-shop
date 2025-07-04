import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { environment } from 'src/environments/environment';
const apiUrl = environment.baseUrl

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token()
  // if (req.url != `${apiUrl}/auth/check-status` || req.url!=`${apiUrl}/api/product`) {
  //   return next(req)
  // }
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  })
  return next(newRequest);
};
