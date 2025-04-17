import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(email: string, password: string): boolean {
    // Simulation d'authentification
    if (email === 'admin@admin.com' && password === '12345678') {
      const userData = {
        email,
        name: 'Administrateur',
        role: 'admin',
        token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
      };

      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      this.isAuthenticatedSubject.next(true);
      return true; // Retourne true si succès
    }
    return false; // Retourne false si échec
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/authentication/login']);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
