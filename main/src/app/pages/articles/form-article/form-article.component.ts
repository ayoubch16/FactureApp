import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Article, CategoryArticle} from "../../../interfaces/entites";
import {Observable} from "rxjs";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-form-article',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule],
  standalone: true,
  templateUrl: './form-article.component.html'
})
export class FormArticleComponent {
  articleForm: FormGroup;
  articles: Article[] = [];
  listearticles: Observable<Article[]>;
  categories: Observable<CategoryArticle[]>;
  isEditMode = false;
  currentArticleId: number | null = null;

  constructor(private fb: FormBuilder,private dataService: DataService) {
    this.articleForm = this.fb.group({
      nameArticle: ['', Validators.required],
      unite: ['', Validators.required],
      categoryArticle: [null, Validators.required],
      descriptionArticle: [''],
      priceArticle: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.categories=this.dataService.getCategories()
  }



  onSubmit(): void {
    if (this.articleForm.valid) {
      const articleData: Article = {
        id: this.isEditMode && this.currentArticleId ? this.currentArticleId : this.generateId(),
        ...this.articleForm.value
      };

      if (this.isEditMode) {
        // Mettre à jour l'article
        const index = this.articles.findIndex(a => a.id === this.currentArticleId);
        if (index !== -1) {
          this.articles[index] = articleData;
        }
      } else {
        // Ajouter un nouvel article
        this.articles.push(articleData);
      }

      console.log('Article sauvegardé:', articleData);
      this.resetForm();
    }
  }





  resetForm(): void {
    this.articleForm.reset();
    this.isEditMode = false;
    this.currentArticleId = null;
  }

  private generateId(): number {
    return this.articles.length > 0
      ? Math.max(...this.articles.map(a => a.id)) + 1
      : 1;
  }
}
