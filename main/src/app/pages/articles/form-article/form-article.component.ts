import {Component, OnInit} from '@angular/core';
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
import {EventBusService} from "../../../services/event-bus.service";
import {Event} from "../../../interfaces/EmitEvent";

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
    MatTooltipModule
  ],
  standalone: true,
  templateUrl: './form-article.component.html'
})
export class FormArticleComponent implements OnInit {
  articleForm: FormGroup;
  articles: Article[] = [];
  categories: Observable<CategoryArticle[]>;
  isEditMode = false;
  currentArticleId: number | null = null;

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private eventBusService: EventBusService,
                ) {
    this.articleForm = this.fb.group({
      nameArticle: ['', Validators.required],
      unite: ['', Validators.required],
      categoryArticle: [null, Validators.required],
      descriptionArticle: [''],
      priceArticle: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.eventBusService.onObserver<Article>([Event.MODIFIER_ARTICLE]).subscribe(
      (article) => {
        this.isEditMode = true;
        this.currentArticleId = article.id;
        this.articleForm.patchValue({
          nameArticle: article.nameArticle,
          unite: article.unite,
          categoryArticle: article.categoryArticle,
          descriptionArticle: article.descriptionArticle,
          priceArticle: article.priceArticle
        });
      }
    );
    this.categories = this.dataService.getCategories();
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




      //  createAnnonce(annonce: Annonce): Observable<Annonce> {
      //     return this.httpService.post(endpoints.annonce.create, annonce);
      //   }
      this.resetForm();
    }
    this.eventBusService.emit<void>(Event.AJOUTER_ARTICLE);

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
