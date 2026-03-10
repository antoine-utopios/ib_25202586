import { Routes } from '@angular/router';

export const albumRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/album-list/album-list').then(m => m.AlbumListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/album-add/album-add').then(m => m.AlbumAddComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/album-detail/album-detail').then(m => m.AlbumDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/album-edit/album-edit').then(m => m.AlbumEditComponent)
  },
  {
    path: ':id/delete',
    loadComponent: () =>
      import('./pages/album-delete/album-delete').then(m => m.AlbumDeleteComponent)
  }
];
