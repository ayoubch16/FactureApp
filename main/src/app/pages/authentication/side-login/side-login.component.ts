import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
  standalone: true
})
export class AppSideLoginComponent {
  isLoading = false; // Pour gérer l'état de chargement

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.form.value;

    // Appel à la méthode login() du AuthService
    if (this.authService.login(email!, password!)) {
      // Succès de la connexion
      this.snackBar.open('Connexion réussie!', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/dashboard']); // Redirection après connexion
    } else {
      // Échec de la connexion
      this.snackBar.open('Email ou mot de passe incorrect', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }

    this.isLoading = false;
  }
}
