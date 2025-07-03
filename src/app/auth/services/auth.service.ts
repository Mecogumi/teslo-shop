import { AuthResponse } from './../interfaces/auth-response.interface';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
const apiUrl = environment.baseUrl
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(localStorage.getItem('token'))
  private http = inject(HttpClient)

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus()
  })

  authSatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking'
    }
    if (this._user()) {
      return 'authenticated'
    }
    return 'not-authenticated'
  })

  user = computed<User | null>(() => this._user());

  token = computed<string | null>(() => this._token())

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${apiUrl}/auth/login`, {
      email: email,
      password: password
    })
      .pipe(
        map(resp => this.handleAuthSucces(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token')
    if (!token) {
      this.logout()
      return of(false)
    }
    return this.http.get<AuthResponse>(`${apiUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    })
      .pipe(
        map(resp => this.handleAuthSucces(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }


  logout() {
    this._authStatus.set('not-authenticated')
    this._token.set(null)
    this._user.set(null)
    localStorage.removeItem('token')
  }

  private handleAuthSucces(resp: AuthResponse): boolean {
    this._authStatus.set('authenticated')
    this._token.set(resp.token)
    this._user.set(resp.user)
    localStorage.setItem('token', resp.token)
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout()
    return of(false)
  }
}
