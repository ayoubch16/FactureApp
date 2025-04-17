// list-client.component.ts
import { Component, OnInit } from '@angular/core';
import {Client} from "../../../interfaces/entites";
import {ClientService} from "../../../services/client.service";
import {MatTab} from "@angular/material/tabs";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  imports: [
    RouterLink,
    MatTable,
    MatIcon
  ],
  standalone: true,
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.clients$.subscribe(clients => {
      this.clients = clients;
    });
  }

  deleteClient(id: number): void {
    this.clientService.deleteClient(id);
  }
}
