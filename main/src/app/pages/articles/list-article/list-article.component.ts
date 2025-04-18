import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule} from "@angular/forms";
import {Article} from "../../../interfaces/entites";
import {Observable} from "rxjs";
import {DataService} from "../../../services/data.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-list-article',
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
  templateUrl: './list-article.component.html',
  standalone: true
})
export class ListArticleComponent implements OnInit {
  articles: Article[] = [];
  listearticles: Observable<Article[]>;
  isEditMode = false;
  currentArticleId: number | null = null;
  displayedColumns: string[] = ['nameArticle', 'unite', 'category', 'price', 'description', 'actions'];

  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.listearticles = this.dataService.getArticles();
  }



  editArticle(article: Article): void {
    this.isEditMode = true;
    this.currentArticleId = article.id;

  }

  deleteArticle(articleId: number): void {
    const index = this.articles.findIndex(a => a.id === articleId);
    if (index !== -1) {
      this.articles.splice(index, 1);
      console.log('Article supprimé:', articleId);
    }
  }

}
