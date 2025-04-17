import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map, startWith } from "rxjs";
import { finalize } from 'rxjs/operators';

import { Article, ArticleTable, Client, Devis, StatutDevis } from "../../../interfaces/entites";
import { DataService } from "../../../services/data.service";
import { FormArticleComponent } from "../../articles/form-article/form-article.component";

// Import des modules Angular Material
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-form-devis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSpinner,
    MatAutocompleteModule
  ],
  templateUrl: './form-devis.component.html',
  styleUrls: ['./form-devis.component.scss']
})
export class FormDevisComponent implements OnInit {
  // Déclaration des données
  clients: Client[] = [];
  listeArticle: Article[] = [];
  listeDevis: Devis[] = [];

  // Observable pour la liste des articles
  private articlesSubject = new BehaviorSubject<ArticleTable[]>([]);
  articles$: Observable<ArticleTable[]> = this.articlesSubject.asObservable();

  // Filtres pour les autocomplétion
  clientFilterCtrl = new FormControl();
  articleFilterCtrl = new FormControl();
  filteredClients: Client[] = [];
  filteredArticles: Article[] = [];

  // Sélections courantes
  selectedClient: Client | null = null;
  selectedArticle: Article | null = null;
  selectedClientId: number | null = null;
  selectedArticleId: number | null = null;

  // Configuration des tables
  colonnesAffichees: string[] = ['#', 'designation', 'description', 'category', 'quantite', 'prixUnitaire', 'prixTotal', 'actions'];
  displayedColumns2: string[] = ['numDevis', 'clientName', 'montant', 'statut', 'date', 'menu'];

  // Données du formulaire
  nouvelArticle: ArticleTable = this.initialiserNouvelArticle();
  totalHT: number = 0;
  tva: number = 0;
  totalTTC: number = 0;
  devisDate: string = new Date().toISOString().split('T')[0];
  devisNumber: string = '';
  currentDevisId: number | null = null;

  // États
  modeEdition: boolean = false;
  articleEnEditionIndex: number = -1;
  isLoading = false;

  @Output() articlesChanged = new EventEmitter<ArticleTable[]>();

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  // Getter pour faciliter l'accès à la liste des articles
  get articles(): ArticleTable[] {
    return this.articlesSubject.value;
  }

  ngOnInit(): void {
    this.initialiserFormulaire();
    this.configurerSubscriptions();
    this.chargerDonnees();
  }

  // Méthodes d'initialisation
  private initialiserFormulaire(): void {
    this.devisNumber = this.generateDocumentNumber();
  }

  private configurerSubscriptions(): void {
    // Observer les changements de la liste d'articles
    this.articles$.subscribe(articles => {
      this.calculerTotaux();
      this.articlesChanged.emit(articles);
    });

    // Configurer les filtres d'autocomplétion
    this.clientFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.raisonSociale),
        map(name => name ? this._filterClients(name) : this.clients.slice())
      )
      .subscribe(clients => {
        this.filteredClients = clients;
      });

    this.articleFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nameArticle),
        map(name => name ? this._filterArticles(name) : this.listeArticle.slice())
      )
      .subscribe(articles => {
        this.filteredArticles = articles;
      });
  }

  // Méthodes de chargement des données
  private chargerDonnees(): void {
    this.loadClients();
    this.loadArticles();
    this.loadDevis();
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

  loadDevis(): void {
    this.isLoading = true;
    this.dataService.getDevis().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(devis => {
      this.listeDevis = devis;
    });
  }

  // Méthodes de filtrage
  private _filterArticles(value: string): Article[] {
    const filterValue = value.toLowerCase();
    return this.listeArticle.filter(article =>
      article.nameArticle.toLowerCase().includes(filterValue)
    );
  }

  private _filterClients(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client =>
      client.raisonSociale.toLowerCase().includes(filterValue)
    );
  }

  // Méthodes de traitement des sélections
  onClientSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedClient = event.option.value;
    this.selectedClientId = this.selectedClient?.id || null;
  }

  onArticleSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedArticle = event.option.value;
    this.selectedArticleId = this.selectedArticle?.id || null;

    if (this.selectedArticle) {
      this.nouvelArticle.description = this.selectedArticle.descriptionArticle;
      this.nouvelArticle.designation = this.selectedArticle.nameArticle;
      this.nouvelArticle.prixUnitaire = this.selectedArticle.priceArticle;
      this.calculerTotal();
    }
  }

  // Méthodes d'affichage pour les autocomplete
  displayClient(client?: Client): string {
    return client ? client.raisonSociale : '';
  }

  displayArticle(article?: Article): string {
    return article ? article.nameArticle : '';
  }

  // Gestion des articles
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

  /**
   * Ajoute ou modifie un article dans la liste après confirmation
   */
  ajouterArticle(): void {
    if (!this.nouvelArticle.designation || !this.nouvelArticle.quantite || !this.nouvelArticle.prixUnitaire) {
      this.showErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Message de confirmation différent selon le mode (ajout ou modification)
    const message = this.modeEdition
      ? `Êtes-vous sûr de vouloir modifier l'article "${this.nouvelArticle.designation}" ?`
      : `Êtes-vous sûr de vouloir ajouter l'article "${this.nouvelArticle.designation}" au devis ?`;

    // Demander confirmation avant d'ajouter ou modifier
    if (confirm(message)) {
      const currentArticles = this.articlesSubject.value;

      if (this.modeEdition && this.articleEnEditionIndex >= 0) {
        // Mode modification
        const updatedArticles = [...currentArticles];
        updatedArticles[this.articleEnEditionIndex] = { ...this.nouvelArticle };
        this.articlesSubject.next(updatedArticles);
        this.modeEdition = false;
        this.articleEnEditionIndex = -1;
        this.showSuccessMessage(`Article "${this.nouvelArticle.designation}" modifié avec succès`);
      } else {
        // Mode ajout
        this.articlesSubject.next([...currentArticles, { ...this.nouvelArticle }]);
        this.showSuccessMessage(`Article "${this.nouvelArticle.designation}" ajouté avec succès`);
      }

      // Réinitialiser le formulaire après ajout
      this.nouvelArticle = this.initialiserNouvelArticle();
      this.articleFilterCtrl.setValue('');
      this.selectedArticle = null;
    }
  }

  /**
   * Supprime un article de la liste après confirmation
   * @param index Index de l'article à supprimer
   */
  supprimerArticle(index: number): void {
    const articleASupprimer = this.articlesSubject.value[index];

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${articleASupprimer.designation}" ?`)) {
      const currentArticles = this.articlesSubject.value;
      const updatedArticles = currentArticles.filter((_, i) => i !== index);
      this.articlesSubject.next(updatedArticles);
      this.showSuccessMessage(`Article "${articleASupprimer.designation}" supprimé avec succès`);

      // Si l'article en cours d'édition est supprimé, réinitialiser le formulaire
      if (this.modeEdition && this.articleEnEditionIndex === index) {
        this.nouvelArticle = this.initialiserNouvelArticle();
        this.modeEdition = false;
        this.articleEnEditionIndex = -1;
      }
    }
  }

  /**
   * Prépare la modification d'un article
   * @param index Index de l'article à modifier
   */
  modifierArticle(index: number): void {
    this.modeEdition = true;
    this.articleEnEditionIndex = index;
    this.nouvelArticle = { ...this.articlesSubject.value[index] };

    // Faire défiler jusqu'au formulaire d'édition
    const formElement = document.querySelector('.article-table-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  calculerTotaux(): void {
    const articles = this.articlesSubject.value;
    this.totalHT = articles.reduce((sum, article) => sum + article.prixTotal, 0);
    this.tva = this.totalHT * 0.2;
    this.totalTTC = this.totalHT + this.tva;
  }

  // Gestion des devis
  private generateDocumentNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    const prefix = 'DEV';
    return `${prefix}-${year}${month}${day}-${random}`;
  }

  /**
   * Enregistre un nouveau devis ou met à jour un devis existant après confirmation
   */
  enregistrerDevis(): void {
    if (!this.selectedClientId || this.articles.length === 0) {
      this.showErrorMessage('Veuillez sélectionner un client et ajouter au moins un article');
      return;
    }

    const client = this.clients.find(c => c.id === this.selectedClientId);
    if (!client) {
      this.showErrorMessage('Client invalide');
      return;
    }

    // Message de confirmation différent selon qu'il s'agit d'un ajout ou d'une modification
    const confirmMessage = this.currentDevisId
      ? `Êtes-vous sûr de vouloir modifier le devis ${this.devisNumber} ?`
      : `Êtes-vous sûr de vouloir enregistrer ce nouveau devis pour ${client.raisonSociale} ?`;

    if (confirm(confirmMessage)) {
      this.isLoading = true;
      const devis: Devis = {
        id: this.currentDevisId || 0,
        numDevis: this.devisNumber,
        client: client,
        montant: this.totalTTC.toFixed(2),
        statut: StatutDevis.EN_ATTENTE,
        date: this.devisDate,
        articles: this.articles.map(article => ({
          designation: article.designation,
          description: article.description,
          quantite: article.quantite,
          prixUnitaire: article.prixUnitaire,
          prixTotal: article.prixTotal
        }))
      };

      const operation$ = this.currentDevisId
        ? this.dataService.updateDevis(devis)
        : this.dataService.addDevis(devis);

      operation$.pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.showSuccessMessage(`Devis ${this.currentDevisId ? 'modifié' : 'ajouté'} avec succès`);
          this.resetForm();
          this.loadDevis();
        },
        error: (error) => {
          this.showErrorMessage(`Erreur: ${error.message || 'Opération échouée'}`);
        }
      });
    }
  }

  /**
   * Charge un devis existant pour modification
   * @param devis Devis à modifier
   */
  editDevis(devis: Devis): void {
    // Demander confirmation avant de charger le devis pour modification
    if (confirm(`Êtes-vous sûr de vouloir modifier le devis ${devis.numDevis} ?`)) {
      this.currentDevisId = devis.id;
      this.selectedClientId = devis.client.id;
      this.selectedClient = devis.client;
      this.devisDate = devis.date;
      this.devisNumber = devis.numDevis;

      // Mettre à jour le champ d'autocomplétion
      this.clientFilterCtrl.setValue(devis.client);

      const articles: ArticleTable[] = devis.articles.map(article => ({
        designation: article.designation,
        description: article.description,
        quantite: article.quantite,
        prixUnitaire: article.prixUnitaire,
        prixTotal: article.prixTotal
      }));

      this.articlesSubject.next(articles);
      this.scrollToForm();
    }
  }

  /**
   * Supprime un devis existant après confirmation
   * @param devis Devis à supprimer
   */
  deleteDevis(devis: Devis): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le devis ${devis.numDevis} pour ${devis.client.raisonSociale} ?`)) {
      this.isLoading = true;
      this.dataService.deleteDevis(devis.id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.showSuccessMessage(`Devis ${devis.numDevis} supprimé avec succès`);
          this.loadDevis();
          if (this.currentDevisId === devis.id) {
            this.resetForm();
          }
        },
        error: (error) => {
          this.showErrorMessage(`Erreur lors de la suppression: ${error.message || 'Opération échouée'}`);
        }
      });
    }
  }

  /**
   * Réinitialise le formulaire après confirmation
   */
  resetForm(): void {
    // Si le formulaire contient des données, demander confirmation
    if (this.selectedClientId || this.articles.length > 0) {
      if (!confirm('Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.')) {
        return;
      }
    }

    this.selectedClientId = null;
    this.selectedClient = null;
    this.clientFilterCtrl.setValue('');
    this.articleFilterCtrl.setValue('');
    this.devisDate = new Date().toISOString().split('T')[0];
    this.devisNumber = this.generateDocumentNumber();
    this.articlesSubject.next([]);
    this.currentDevisId = null;
    this.nouvelArticle = this.initialiserNouvelArticle();
    this.modeEdition = false;
    this.articleEnEditionIndex = -1;
  }

  get canSaveDevis(): boolean {
    return !!this.selectedClientId && this.articles.length > 0;
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

  private scrollToForm(): void {
    const formElement = document.querySelector('.cardWithShadow');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Gestion des notifications
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
