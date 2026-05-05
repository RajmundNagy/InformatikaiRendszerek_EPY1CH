import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLoginMode = true;
  email = '';
  password = '';
  errorMessage = '';

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Kérlek, tölts ki minden mezőt!';
      return;
    }

    const credentials = { email: this.email, password: this.password };

    if (this.isLoginMode) {
      this.authService.login(credentials).subscribe({
        next: (res: any) => {
          console.log('Sikeres bejelentkezés!', res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/vehicles']);
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.message || 'Hiba a bejelentkezés során.';
        }
      });
    } else {
      this.authService.register(credentials).subscribe({
        next: (res: any) => {
          console.log('Sikeres regisztráció!', res);
          this.toggleMode();
          this.errorMessage = 'Sikeres regisztráció! Most már bejelentkezhetsz.';
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.message || 'Hiba a regisztráció során.';
        }
      });
    }
  }
}