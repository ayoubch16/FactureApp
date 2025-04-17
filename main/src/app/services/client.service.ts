// client.service.ts
import { Injectable } from '@angular/core';
import { Client } from '../interfaces/entites';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSource = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSource.asObservable();

  constructor() {}

  getClients(): Client[] {
    return this.clientsSource.value;
  }

  addClient(client: Client): void {
    const current = this.clientsSource.value;
    this.clientsSource.next([...current, client]);
  }

  updateClient(updatedClient: Client): void {
    const clients = this.clientsSource.value;
    const index = clients.findIndex(c => c.id === updatedClient.id);
    if (index !== -1) {
      clients[index] = updatedClient;
      this.clientsSource.next([...clients]);
    }
  }

  deleteClient(id: number): void {
    const clients = this.clientsSource.value.filter(c => c.id !== id);
    this.clientsSource.next(clients);
  }
}
