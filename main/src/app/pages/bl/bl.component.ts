import { Component } from '@angular/core';
import {FormBlComponent} from "./form-bl/form-bl.component";
import {ListBlComponent} from "./list-bl/list-bl.component";

@Component({
  selector: 'app-bl',
  imports: [FormBlComponent],
  standalone: true,
  templateUrl: './bl.component.html'
})
export class BlComponent {

}
