import { Component } from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgScrollbarModule} from "ngx-scrollbar";
import {Devis} from "../../../interfaces/entites";
import {Observable} from "rxjs";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-list-devis',
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule
  ],
  standalone: true,
  templateUrl: './list-devis.component.html'
})
export class ListDevisComponent {
  devis: Devis[];
  listeDevis: Observable<Devis[]>;
  displayedColumns2: string[] = ['numDevis', 'clientName', 'montant', 'statut','date','menu'];



  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.listeDevis=this.dataService.getDevis()
  }



  editDevis(element:any) {

  }

  deleteDevis(element:any) {

  }
}
