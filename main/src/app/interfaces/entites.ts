export interface Article {
  id:number
  unite:string
  categoryArticle:CategoryArticle
  nameArticle:string
  descriptionArticle:string
  priceArticle:number
}

export interface CategoryArticle {
  id:number
  category:string
}

export interface Facture {
  id: number;
  numFacture: string;
  client: Client;
  montant: string;
  statut: StatutFacture;
  date: string;
  articles: ArticleTable[];
}

export interface Devis {
  id: number;
  numDevis: string;
  client: Client;
  montant: string;
  statut: StatutDevis;
  date: string;
  articles: ArticleTable[];
}

export interface Bl {
  id: number;
  numBl: string;
  client: Client;
  statut: StatutBL;
  date: string;
  articles: ArticleTable[];
}

export enum StatutDevis {
  EN_ATTENTE = 'En attente',
  ACCEPTE = 'Accepté',
  REFUSE = 'Refusé',
  EXPIRE = 'Expiré',
  TRANSFORME_FACTURE = 'Transformé en facture'
}

export enum StatutFacture {
  BROUILLON = 'Brouillon',
  NON_PAYEE = 'Non payée',
  PARTIELLEMENT_PAYEE = 'Partiellement payée',
  PAYEE = 'Payée',
  ANNULEE = 'Annulée',
  EN_RETARD = 'En retard'
}

export enum StatutBL {
  EN_PREPARATION = 'En préparation',
  LIVRE = 'Livré',
  PARTIELLEMENT_LIVRE = 'Partiellement livré',
  ANNULE = 'Annulé',
  FACTURE = 'Facturé'
}



export  interface Client {
    id: number;
    raisonSociale: string;
    ville: string;
    ice: string;
    telephone: string;
    email:string
}

export interface ArticleTable {
  designation:string
  description:string
  quantite:number
  prixUnitaire:number
  prixTotal:number
}

export enum TypeDocument {
  DEVIS = 'DEVIS',
  FACTURE = 'FACTURE',
  BL = 'BL'
}
