package org.example.back.domain;

import jakarta.persistence.*;
import lombok.*;
import org.example.back.domain.enums.TypeDocument;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "article_table")
public class ArticleTableBl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String designation;
    private String description;
    private int quantite;
    private double prixUnitaire;
    private double prixTotal;

    @ManyToOne
    @JoinColumn(name = "bl_id")
    private Bl bl;

}