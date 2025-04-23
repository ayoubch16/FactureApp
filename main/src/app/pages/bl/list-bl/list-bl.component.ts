import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Bl } from "../../../interfaces/entites";
import { DataService } from "../../../services/data.service";
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBlComponent } from "../form-bl/form-bl.component";

@Component({
  selector: 'app-list-bl',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './list-bl.component.html'
})
export class ListBlComponent implements OnInit {
  listeBls: Bl[] = [];
  displayedColumns: string[] = ['numBl', 'clientName', 'statut', 'date', 'menu'];
  isLoading = false;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private formBlComponent: FormBlComponent
  ) { }

  ngOnInit(): void {
    this.loadBls();
  }

  loadBls(): void {
    this.isLoading = true;
    this.dataService.getBls().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(bls => {
      this.listeBls = bls;
    });
  }

  editBl(bl: Bl): void {
    this.formBlComponent.editBl(bl);
  }

  deleteBl(bl: Bl): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce BL ?')) {
      this.isLoading = true;
      this.dataService.deleteBl(bl.id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.showSuccessMessage('BL supprimé avec succès');
          this.loadBls();
        },
        error: (error: { message: any; }) => {
          this.showErrorMessage(`Erreur lors de la suppression: ${error.message}`);
        }
      });
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
