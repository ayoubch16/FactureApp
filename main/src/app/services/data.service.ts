import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";
import {Article, Bl, CategoryArticle, Client, Devis, Facture, Ville} from "../interfaces/entites";



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private basePath = 'assets/data/';
  private clientsData = new BehaviorSubject<Client[]>([]);
  constructor(private http: HttpClient) {
    this.loadInitialClients();
  }

  // Articles
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.basePath}article.data.json`);
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.http.get<Article[]>(`${this.basePath}article.data.json`).pipe(
      map(articles => articles.find(a => a.id === id))
    );
  }

  // Catégories
  getCategories(): Observable<CategoryArticle[]> {
    return this.http.get<CategoryArticle[]>(`${this.basePath}category.data.json`);
  }

  //Devis
  getDevis():Observable<Devis[]> {
    return this.http.get<Devis[]>(`${this.basePath}devis.data.json`);
  }



  // Factures
  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.basePath}facture.data.json`);
  }

  updateFacture(facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.basePath}/facture`, facture);
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/facture/${id}`);
  }


  getFactureById(id: number): Observable<Facture | undefined> {
    return this.http.get<Facture[]>(`${this.basePath}facture.data.json`).pipe(
      map(factures => factures.find(f => f.id === id))
    );
  }


private loadInitialClients(): void {
  this.http.get<Client[]>(`${this.basePath}client.data.json`).pipe(
    tap(clients => this.clientsData.next(clients))
  ).subscribe();
}

// Clients
getClients(): Observable<Client[]> {
  return this.clientsData.asObservable();
}

getClientById(id: number): Observable<Client | undefined> {
  return this.clientsData.pipe(
    map(clients => clients.find(c => c.id === id))
  );
}

addClient(client: Client): Observable<Client> {
  const currentClients = this.clientsData.value;
  client.id = this.generateId(currentClients);
  const updatedClients = [...currentClients, client];
  this.clientsData.next(updatedClients);
  this.saveClientsToFile(updatedClients);
  return of(client);
}

updateClient(client: Client): Observable<Client> {
  const currentClients = this.clientsData.value;
  const index = currentClients.findIndex(c => c.id === client.id);

  if (index !== -1) {
  const updatedClients = [...currentClients];
  updatedClients[index] = client;
  this.clientsData.next(updatedClients);
  this.saveClientsToFile(updatedClients);
}
return of(client);
}

deleteClient(id: number): Observable<boolean> {
  const currentClients = this.clientsData.value;
  const updatedClients = currentClients.filter(c => c.id !== id);
  this.clientsData.next(updatedClients);
  this.saveClientsToFile(updatedClients);
  return of(true);
}

private generateId(clients: Client[]): number {
  return clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
}

private saveClientsToFile(clients: Client[]): void {
  const dataStr = JSON.stringify(clients, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'client.data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}




  addDevis(devis: Devis): Observable<Devis> {
    // Implémentation qui retourne un Observable
    return this.http.post<Devis>(`${this.basePath}/devis`, devis);
  }

  updateDevis(devis: Devis): Observable<Devis> {
    return this.http.put<Devis>(`${this.basePath}/devis/${devis.id}`, devis);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/devis/${id}`);
  }

  // BL
  getBls(): Observable<Bl[]> {
    return this.http.get<Bl[]>(`${this.basePath}bl.data.json`);
  }

  updateBl(bl: Bl): Observable<Bl> {
    return this.http.put<Bl>(`${this.basePath}/bl/${bl.id}`, bl);
  }

  deleteBl(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/bl/${id}`);
  }


  //ville
  getVille(): Observable<Ville[]> {
    return this.http.get<Ville[]>(`${this.basePath}ville.data.json`);
  }




}
