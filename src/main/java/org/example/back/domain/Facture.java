package org.example.back.domain;

import jakarta.persistence.*;
import lombok.*;
import org.example.back.domain.enums.StatutFacture;

import java.time.LocalDate;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "facture")
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numFacture;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private String montant;

    @Enumerated(EnumType.STRING)
    private StatutFacture statut;

    private LocalDate date;

    @OneToMany(mappedBy = "facture")
    private List<ArticleTableFacture> articles;

}