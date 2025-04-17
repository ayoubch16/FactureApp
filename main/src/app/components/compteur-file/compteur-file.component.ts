import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-compteur-file',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, TablerIconsModule, NgClass],
  templateUrl: './compteur-file.component.html'
})
export class CompteurFileComponent implements OnInit {
  @Input() typeDocument: string = ''; // DEVIS, FACTURE ou BL
  nombreDocuments: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Ici vous pouvez implémenter la logique pour récupérer le nombre de documents
    // en fonction du typeDocument
    this.calculerNombreDocuments();
  }

  calculerNombreDocuments(): void {
    // Exemple de logique - à remplacer par votre implémentation réelle
    switch(this.typeDocument) {
      case 'DEVIS':
        this.nombreDocuments = 85; // Remplacer par votre valeur réelle
        break;
      case 'FACTURE':
        this.nombreDocuments = 140;
        break;
      case 'BL':
        this.nombreDocuments = 65;
        break;
      default:
        this.nombreDocuments = 0;
    }

    // Alternative: vous pourriez faire un appel API ici pour récupérer le nombre
    // this.documentService.getCountByType(this.typeDocument).subscribe(count => {
    //   this.nombreDocuments = count;
    // });
  }

  getCardClass(): string {
    switch(this.typeDocument) {
      case 'DEVIS':
        return 'bg-light-primary'; // Classe CSS pour DEVIS
      case 'FACTURE':
        return 'bg-light-error';   // Classe CSS pour FACTURE
      case 'BL':
        return 'bg-light-success'; // Classe CSS pour BL
      default:
        return 'bg-light-info';    // Classe par défaut
    }
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
