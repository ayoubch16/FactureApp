import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from "rxjs";
import {finalize} from 'rxjs/operators';

import {Article, ArticleTable, Bl, Client, StatutBL} from "../../../interfaces/entites";
import {DataService} from "../../../services/data.service";
import {FormArticleComponent} from "../../articles/form-article/form-article.component";
import {MatSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-form-bl',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSpinner,
  ],
  templateUrl: './form-bl.component.html'
})
export class FormBlComponent implements OnInit {
  clients: Client[] = [];
  listeArticle: Article[] = [];
  listeBls: Bl[] = [];
  public articlesSubject = new BehaviorSubject<ArticleTable[]>([]);
  articles$: Observable<ArticleTable[]> = this.articlesSubject.asObservable();

  get articles(): ArticleTable[] {
    return this.articlesSubject.value;
  }

  colonnesAffichees: string[] = ['#', 'designation', 'description', 'quantite', 'prixUnitaire', 'prixTotal', 'actions'];
  displayedColumns2: string[] = ['numBl', 'clientName', 'statut', 'date', 'menu'];

  nouvelArticle: ArticleTable = this.initialiserNouvelArticle();
  modeEdition: boolean = false;
  articleEnEditionIndex: number = -1;
  isLoading = false;

  clientName: string;
  selectedClientId: number | null = null;
  blDate: string = new Date().toISOString().split('T')[0];
  blNumber: string = '';
  currentBlId: number | null = null;
  isEditMode = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.articles$.subscribe(() => {
      this.calculerTotaux();
    });

    this.loadClients();
    this.loadArticles();
    this.loadBls();
  }

  loadClients(): void {
    this.isLoading = true;
    this.dataService.getClients().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(clients => {
      this.clients = clients;
    });
  }

  loadArticles(): void {
    this.isLoading = true;
    this.dataService.getArticles().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(articles => {
      this.listeArticle = articles;
    });
  }

  loadBls(): void {
    this.isLoading = true;
    this.dataService.getBls().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(bls => {
      this.listeBls = bls;
    });
  }

  ouvrirFormulaireArticle(): void {
    const dialogRef = this.dialog.open(FormArticleComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadArticles();
      }
    });
  }

  onArticleSelected(event: any): void {
    const selectedArticle: Article = event.value;
    this.nouvelArticle.description = selectedArticle.descriptionArticle;
    this.nouvelArticle.designation = selectedArticle.nameArticle;
    this.nouvelArticle.prixUnitaire = selectedArticle.priceArticle;
    this.calculerTotal();
  }

  initialiserNouvelArticle(): ArticleTable {
    return {
      designation: '',
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      prixTotal: 0
    };
  }

  calculerTotal(): void {
    this.nouvelArticle.prixTotal = this.nouvelArticle.quantite * this.nouvelArticle.prixUnitaire;
  }

  ajouterArticle(): void {
    if (this.nouvelArticle.designation && this.nouvelArticle.quantite && this.nouvelArticle.prixUnitaire) {
      const currentArticles = this.articlesSubject.value;

      if (this.modeEdition && this.articleEnEditionIndex >= 0) {
        const updatedArticles = [...currentArticles];
        updatedArticles[this.articleEnEditionIndex] = { ...this.nouvelArticle };
        this.articlesSubject.next(updatedArticles);
        this.modeEdition = false;
        this.articleEnEditionIndex = -1;
      } else {
        this.articlesSubject.next([...currentArticles, { ...this.nouvelArticle }]);
      }

      this.nouvelArticle = this.initialiserNouvelArticle();
    }
  }

  supprimerArticle(index: number): void {
    const currentArticles = this.articlesSubject.value;
    const updatedArticles = currentArticles.filter((_, i) => i !== index);
    this.articlesSubject.next(updatedArticles);
  }

  modifierArticle(index: number): void {
    this.modeEdition = true;
    this.articleEnEditionIndex = index;
    this.nouvelArticle = { ...this.articlesSubject.value[index] };
  }

  calculerTotaux(): void {
    // Pas de calcul de total pour les BLs (optionnel selon besoin)
  }

  enregistrerBl(): void {
    if (!this.selectedClientId || this.articles.length === 0) {
      alert('Veuillez sélectionner un client et ajouter au moins un article');
      return;
    }

    const client = this.clients.find(c => c.id === this.selectedClientId);
    if (!client) return;

    this.isLoading = true;
    const bl: Bl = {
      id: this.currentBlId || 0,
      numBl: this.blNumber,
      client: client,
      statut: StatutBL.EN_PREPARATION,
      date: this.blDate,
      articles: this.articles.map(article => ({
        designation: article.designation,
        description: article.description,
        quantite: article.quantite,
        prixUnitaire: article.prixUnitaire,
        prixTotal: article.prixTotal
      }))
    };

    this.dataService.updateBl(bl).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.showSuccessMessage('BL modifié avec succès');
        this.loadBls();
      },
      error: (error: { message: any; }) => {
        this.showErrorMessage(`Erreur: ${error.message}`);
      }
    });
  }

  editBl(bl: Bl): void {
    this.isEditMode = true;
    this.currentBlId = bl.id;
    this.selectedClientId = bl.client.id;
    this.clientName = bl.client.raisonSociale
    this.blDate = bl.date;
    this.blNumber = bl.numBl;

    const articles: ArticleTable[] = bl.articles.map(article => ({
      designation: article.designation,
      description: article.description,
      quantite: article.quantite,
      prixUnitaire: article.prixUnitaire,
      prixTotal: article.prixTotal
    }));

    this.articlesSubject.next(articles);
    this.scrollToForm();
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
          if (this.currentBlId === bl.id) {
            this.resetForm();
          }
        },
        error: (error: { message: any; }) => {
          this.showErrorMessage(`Erreur lors de la suppression: ${error.message}`);
        }
      });
    }
  }

  resetForm(): void {
    this.selectedClientId = null;
    this.blDate = new Date().toISOString().split('T')[0];
    this.blNumber = '';
    this.articlesSubject.next([]);
    this.currentBlId = null;
    this.isEditMode = false;
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
