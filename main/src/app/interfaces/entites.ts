// Interfaces
export interface Article {
  id: number;
  unite: string;
  categoryArticle: CategoryArticle;
  nameArticle: string;
  descriptionArticle: string;
  priceArticle: number;
}

export interface ArticleTable {
  id?: number;
  designation: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export interface ArticleTableBl {
  id?: number;
  designation: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  bl?: Bl;
}

export interface ArticleTableDevis {
  id?: number;
  designation: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  devis?: Devis;
}

export interface ArticleTableFacture {
  id?: number;
  designation: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  facture?: Facture;
}

export interface Bl {
  id: number;
  numBl: string;
  client: Client;
  statut: StatutBL;
  date: string;
  articles: ArticleTableBl[];
}

export interface CategoryArticle {
  id: number;
  category: string;
}

export interface Client {
  id: number;
  raisonSociale: string;
  ville: Ville;
  ice: string;
  telephone: string;
  email: string;
}

export interface Devis {
  id: number;
  numDevis: string;
  client: Client;
  montant: string;
  statut: StatutDevis;
  date: string;
  articles: ArticleTableDevis[];
}

export interface Facture {
  id: number;
  numFacture: string;
  client: Client;
  montant: string;
  statut: StatutFacture;
  date: string;
  articles: ArticleTableFacture[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
}

export interface Ville {
  id: number;
  nom: string;
  codePostal: string;
  region: string;
}

// Enums
export enum TypeDocument {
  DEVIS = 'DEVIS',
  FACTURE = 'FACTURE',
  BL = 'BL'
}

export enum StatutFacture {
  BROUILLON = 'BROUILLON',
  NON_PAYEE = 'NON_PAYEE',
  PARTIELLEMENT_PAYEE = 'PARTIELLEMENT_PAYEE',
  PAYEE = 'PAYEE',
  ANNULEE = 'ANNULEE',
  EN_RETARD = 'EN_RETARD'
}

export enum StatutDevis {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EXPIRE = 'EXPIRE',
  TRANSFORME_FACTURE = 'TRANSFORME_FACTURE'
}

export enum StatutBL {
  EN_PREPARATION = 'EN_PREPARATION',
  LIVRE = 'LIVRE',
  PARTIELLEMENT_LIVRE = 'PARTIELLEMENT_LIVRE',
  ANNULE = 'ANNULE',
  FACTURE = 'FACTURE'
}

export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
  ROLE_CLIENT = 'ROLE_CLIENT',
  ROLE_VENDEUR = 'ROLE_VENDEUR',
  ROLE_COMPTABLE = 'ROLE_COMPTABLE',
  ROLE_COMMERCIAL = 'ROLE_COMMERCIAL'
}



// export interface Article {
//   id:number
//   unite:string
//   categoryArticle:CategoryArticle
//   nameArticle:string
//   descriptionArticle:string
//   priceArticle:number
// }
//
// export interface CategoryArticle {
//   id:number
//   category:string
// }
//
// export interface Facture {
//   id: number;
//   numFacture: string;
//   client: Client;
//   montant: string;
//   statut: StatutFacture;
//   date: string;
//   articles: ArticleTable[];
// }
//
// export interface Devis {
//   id: number;
//   numDevis: string;
//   client: Client;
//   montant: string;
//   statut: StatutDevis;
//   date: string;
//   articles: ArticleTable[];
// }
//
// export interface Bl {
//   id: number;
//   numBl: string;
//   client: Client;
//   statut: StatutBL;
//   date: string;
//   articles: ArticleTable[];
// }
//
// export enum StatutDevis {
//   EN_ATTENTE = 'En attente',
//   ACCEPTE = 'Accepté',
//   REFUSE = 'Refusé',
//   EXPIRE = 'Expiré',
//   TRANSFORME_FACTURE = 'Transformé en facture'
// }
//
// export enum StatutFacture {
//   BROUILLON = 'Brouillon',
//   NON_PAYEE = 'Non payée',
//   PARTIELLEMENT_PAYEE = 'Partiellement payée',
//   PAYEE = 'Payée',
//   ANNULEE = 'Annulée',
//   EN_RETARD = 'En retard'
// }
//
// export enum StatutBL {
//   EN_PREPARATION = 'En préparation',
//   LIVRE = 'Livré',
//   PARTIELLEMENT_LIVRE = 'Partiellement livré',
//   ANNULE = 'Annulé',
//   FACTURE = 'Facturé'
// }
//
//
//
// export  interface Client {
//     id: number;
//     raisonSociale: string;
//     ville: string;
//     ice: string;
//     telephone: string;
//     email:string
// }
//
// export interface ArticleTable {
//   designation:string
//   description:string
//   quantite:number
//   prixUnitaire:number
//   prixTotal:number
// }
//
// export enum TypeDocument {
//   DEVIS = 'DEVIS',
//   FACTURE = 'FACTURE',
//   BL = 'BL'
// }
//
// export interface Ville {
//   ville:string
//   codePostal:string
//   region:string
// }
