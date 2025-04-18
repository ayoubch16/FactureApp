import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {Facture} from "../../interfaces/entites";

interface Fichier {
  numero: string;
  client: string;
  montant: number;
  statut: string;
  date: Date;
}

@Component({
  selector: 'app-derniers-fichiers',
  standalone: true,
  imports: [MaterialModule, MatTableModule, MatMenuModule, CommonModule, DatePipe],
  templateUrl: './derniers-fichiers.component.html'
})
export class DerniersFichiersComponent implements OnInit {
  @Input() typeDocument = ''; // 'FACTURE', 'DEVIS' ou 'BL'
  listeFichiers: Observable<Facture[]> ;
  displayedColumns: string[] = ['numero', 'client', 'montant', 'statut', 'date', 'actions'];


  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.chargerDerniersFichiers();
  }

  chargerDerniersFichiers(): void {
    // Simulation de données - À remplacer par un appel API réel
    switch(this.typeDocument) {
      case 'FACTURE':
        this.listeFichiers = this.getSampleFactures();
        break;
      case 'DEVIS':
        this.listeFichiers = this.getSampleFactures();
        break;
      case 'BL':
        this.listeFichiers = this.getSampleFactures();
        break;
      default:
        // this.listeFichiers = [];
    }
  }

  getCardClass(): string {
    switch(this.typeDocument) {
      case 'DEVIS': return 'bg-light-primary';
      case 'FACTURE': return 'bg-light-error';
      case 'BL': return 'bg-light-success';
      default: return 'bg-light-info';
    }
  }

  getStatusClass(statut: string): string {
    switch(statut) {
      case 'Payé': return 'text-success';
      case 'Partiellement payé': return 'text-warning';
      case 'Impayé': return 'text-danger';
      case 'En attente': return 'text-info';
      default: return '';
    }
  }

  // Méthodes d'actions
  edit(element: Fichier): void {
    console.log('Modifier', element);
    // Implémentez la logique d'édition
  }

  delete(element: Fichier): void {
    console.log('Supprimer', element);
    // Implémentez la logique de suppression
  }

  download(element: Fichier): void {
    console.log('Télécharger', element);
    // Implémentez la logique de téléchargement
  }

  print(element: Fichier): void {
    console.log('Imprimer', element);
    // Implémentez la logique d'impression
  }

  // Exemples de données (à remplacer par des appels API)
  private getSampleFactures(): Observable<Facture[]> {
    return this.dataService.getFactures()
    // return [
    //   { numero: 'FAC-2023-001', client: 'Client A', montant: 1500, statut: 'Payé', date: new Date('2023-05-15') },
    //   { numero: 'FAC-2023-002', client: 'Client B', montant: 2300, statut: 'Partiellement payé', date: new Date('2023-05-14') },
    //   { numero: 'FAC-2023-003', client: 'Client C', montant: 1800, statut: 'Impayé', date: new Date('2023-05-13') },
    //   { numero: 'FAC-2023-004', client: 'Client D', montant: 3200, statut: 'Payé', date: new Date('2023-05-12') },
    //   { numero: 'FAC-2023-005', client: 'Client E', montant: 2750, statut: 'En attente', date: new Date('2023-05-11') }
    // ];
  }

  private getSampleDevis(): Fichier[] {
    return [
      { numero: 'DEV-2023-001', client: 'Client X', montant: 4200, statut: 'En attente', date: new Date('2023-05-10') },
      { numero: 'DEV-2023-002', client: 'Client Y', montant: 3800, statut: 'Accepté', date: new Date('2023-05-09') },
      { numero: 'DEV-2023-003', client: 'Client Z', montant: 2950, statut: 'Refusé', date: new Date('2023-05-08') },
      { numero: 'DEV-2023-004', client: 'Client W', montant: 5100, statut: 'En attente', date: new Date('2023-05-07') },
      { numero: 'DEV-2023-005', client: 'Client V', montant: 3400, statut: 'Accepté', date: new Date('2023-05-06') }
    ];
  }

  private getSampleBL(): Fichier[] {
    return [
      { numero: 'BL-2023-001', client: 'Fournisseur 1', montant: 0, statut: 'Livré', date: new Date('2023-05-05') },
      { numero: 'BL-2023-002', client: 'Fournisseur 2', montant: 0, statut: 'En cours', date: new Date('2023-05-04') },
      { numero: 'BL-2023-003', client: 'Fournisseur 3', montant: 0, statut: 'Annulé', date: new Date('2023-05-03') },
      { numero: 'BL-2023-004', client: 'Fournisseur 4', montant: 0, statut: 'Livré', date: new Date('2023-05-02') },
      { numero: 'BL-2023-005', client: 'Fournisseur 5', montant: 0, statut: 'En cours', date: new Date('2023-05-01') }
    ];
  }

  getIconClass(): string {
    switch(this.typeDocument) {
      case 'DEVIS':
        return 'bg-primary'; // Couleur d'icône pour DEVIS
      case 'FACTURE':
        return 'bg-error';   // Couleur d'icône pour FACTURE
      case 'BL':
        return 'bg-success'; // Couleur d'icône pour BL
      default:
        return 'bg-info';    // Couleur par défaut
    }
  }
}
