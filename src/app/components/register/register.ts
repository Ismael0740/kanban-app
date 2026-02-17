import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  async onSubmit(): Promise<void> {
    this.error = '';
    if (!this.email.trim() || !this.password) {
      this.error = 'Email y contraseña requeridos';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    try {
      await this.auth.register(this.email.trim(), this.password);
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.error = (err as { error?: { error?: string } })?.error?.error ?? 'Error al registrarse';
    } finally {
      this.loading = false;
    }
  }
}
