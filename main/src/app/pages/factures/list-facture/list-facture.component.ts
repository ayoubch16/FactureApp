import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgScrollbarModule} from "ngx-scrollbar";
import {DataService} from "../../../services/data.service";
import {Facture} from "../../../interfaces/entites";
import {Observable} from "rxjs";


@Component({
  selector: 'app-list-facture',
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule
  ],
  templateUrl: './list-facture.component.html',
  standalone: true
})
export class ListFactureComponent implements OnInit {
  factures: Facture[];
  listefactures: Observable<Facture[]>;
  displayedColumns2: string[] = ['numFacture', 'clientName', 'montant', 'statut','date','menu'];



  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.listefactures=this.dataService.getFactures()
  }



  editFacture(element:any) {

  }

  deleteFacture(element:any) {

  }
}
