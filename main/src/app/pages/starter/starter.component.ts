import {Component, Input, ViewEncapsulation} from '@angular/core';
import { MaterialModule } from '../../material.module';
import {CompteurFileComponent} from "../../components/compteur-file/compteur-file.component";
import {TypeDocument} from "../../interfaces/entites";
import {DerniersFichiersComponent} from "../../components/derniers-fichiers/derniers-fichiers.component";

@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    CompteurFileComponent,
    DerniersFichiersComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class StarterComponent {
  @Input() typeDocument: TypeDocument;
}
