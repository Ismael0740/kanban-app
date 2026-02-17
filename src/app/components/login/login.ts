import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  async onSubmit(): Promise<void> {
    this.error = '';
    if (!this.email.trim() || !this.password) {
      this.error = 'Email y contraseña requeridos';
      return;
    }
    this.loading = true;
    try {
      await this.auth.login(this.email.trim(), this.password);
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.error = (err as { error?: { error?: string } })?.error?.error ?? 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
