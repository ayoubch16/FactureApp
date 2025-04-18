import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'factures',
        loadChildren: () =>
          import('./pages/factures/factures.routes').then((m) => m.FacturesRoutes),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./pages/clients/cleints.routes').then((m) => m.CleintsRoutes),
      },
      {
        path: 'articles',
        loadChildren: () =>
          import('./pages/articles/articles.routes').then((m) => m.ArticlesRoutes),
      },
      {
        path: 'devis',
        loadChildren: () =>
          import('./pages/devis/devis.routes').then((m) => m.DevisRoutes),
      },
      {
        path: 'bl',
        loadChildren: () =>
          import('./pages/bl/bl.routers').then((m) => m.BlRouters),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
