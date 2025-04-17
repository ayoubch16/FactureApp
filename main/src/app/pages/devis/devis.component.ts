import { Component } from '@angular/core';
import {FormDevisComponent} from "./form-devis/form-devis.component";
import {ListDevisComponent} from "./list-devis/list-devis.component";

@Component({
  selector: 'app-devis',
  imports: [FormDevisComponent],
  templateUrl: './devis.component.html',
  standalone: true,
  styleUrl: './devis.component.scss'
})
export class DevisComponent {

}
