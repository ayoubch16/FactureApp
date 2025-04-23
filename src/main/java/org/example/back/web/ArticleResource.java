package org.example.back.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.example.back.domain.Article;
import org.example.back.repository.ArticleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@Transactional
@Slf4j
@AllArgsConstructor
@Builder
public class ArticleResource {

    private final ArticleRepository articleRepository;


    @PostMapping
    public ResponseEntity<List<Article>> create(@RequestBody List<Article> articles) {
        List<Article> savedArticles = articleRepository.saveAll(articles);
        return ResponseEntity.ok(savedArticles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> update(@PathVariable Long id, @RequestBody Article article) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));

        if (article.getUnite() != null) {
            existingArticle.setUnite(article.getUnite());
        }
        if (article.getNameArticle() != null) {
            existingArticle.setNameArticle(article.getNameArticle());
        }
        if (article.getDescriptionArticle() != null) {
            existingArticle.setDescriptionArticle(article.getDescriptionArticle());
        }
        if (article.getCategoryArticle() != null) {
            existingArticle.setCategoryArticle(article.getCategoryArticle());
        }
        if (article.getPriceArticle() != 0.0) { // Pour un double, vérifiez une valeur par défaut
            existingArticle.setPriceArticle(article.getPriceArticle());
        }

        return ResponseEntity.ok(articleRepository.save(existingArticle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable Long id) {
        return ResponseEntity.ok(articleRepository.findById(id).orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAll() {
        return ResponseEntity.ok(articleRepository.findAll());
    }

}
