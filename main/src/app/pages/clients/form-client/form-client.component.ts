import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Client } from "../../../interfaces/entites";
import { DataService } from "../../../services/data.service";
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-client',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './form-client.component.html',
})
export class FormClientComponent implements OnInit {
  clientForm: FormGroup;
  clients$: Observable<Client[]>;
  isEditMode = false;
  currentClientId: number | null = null;
  isLoading = false;
  displayedColumns: string[] = ['raisonSociale', 'adresse', 'ice', 'telephone', 'email', 'actions'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      raisonSociale: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      region: ['', Validators.required],
      pays: ['', Validators.required],
      ice: ['', [Validators.required, Validators.pattern(/^[0-9]{7}$/)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clients$ = this.dataService.getClients().pipe(
      finalize(() => this.isLoading = false)
    );
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.isLoading = true;
    const clientData: Client = {
      ...this.clientForm.value,
      id: this.isEditMode && this.currentClientId ? this.currentClientId : 0
    };

    const operation$ = this.isEditMode
      ? this.dataService.updateClient(clientData)
      : this.dataService.addClient(clientData);

    operation$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.showSuccessMessage(`Client ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`);
        this.resetForm();
        this.loadClients();
      },
      error: (error) => {
        this.showErrorMessage(`Erreur: ${error.message}`);
      }
    });
  }

  editClient(client: Client): void {
    this.isEditMode = true;
    this.currentClientId = client.id;
    this.clientForm.patchValue(client);
    this.scrollToForm();
  }

  deleteClient(clientId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.isLoading = true;
      this.dataService.deleteClient(clientId).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.showSuccessMessage('Client supprimé avec succès');
          this.loadClients();
        },
        error: (error) => {
          this.showErrorMessage(`Erreur lors de la suppression: ${error.message}`);
        }
      });
    }
  }

  resetForm(): void {
    this.clientForm.reset();
    this.isEditMode = false;
    this.currentClientId = null;
  }

  private scrollToForm(): void {
    const formElement = document.querySelector('.cardWithShadow');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
