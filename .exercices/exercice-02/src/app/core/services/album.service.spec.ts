import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AlbumService } from './album.service';
import { Album, AlbumCreateDTO, AlbumUpdateDTO } from '../models/album.model';

describe('AlbumService', () => {
  let service: AlbumService;
  let httpMock: HttpTestingController;

  const mockAlbum: Album = {
    id: '1', nom: 'Dark Side of the Moon', interprete: 'Pink Floyd',
    dateSortie: '1973-03-01', nombrePistes: 10, note: 5,
    imageURL: 'https://example.com/dsotm.jpg', genre: 'Rock',
  };

  const mockAlbums: Album[] = [
    mockAlbum,
    { id: '2', nom: 'Thriller', interprete: 'Michael Jackson', dateSortie: '1982-11-30', nombrePistes: 9, note: 4, imageURL: '', genre: 'Pop' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlbumService],
    });
    service = TestBed.inject(AlbumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('devrait retourner tous les albums via GET', () => {
      service.getAll().subscribe((albums) => {
        expect(albums).toEqual(mockAlbums);
        expect(albums.length).toBe(2);
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums'));
      expect(req.request.method).toBe('GET');
      req.flush(mockAlbums);
    });

    it('devrait retourner un tableau vide si aucun album', () => {
      service.getAll().subscribe((albums) => {
        expect(albums).toEqual([]);
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums'));
      req.flush([]);
    });
  });

  describe('getById()', () => {
    it('devrait retourner un album par son id via GET', () => {
      service.getById('1').subscribe((album) => {
        expect(album).toEqual(mockAlbum);
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums/1'));
      expect(req.request.method).toBe('GET');
      req.flush(mockAlbum);
    });

    it("devrait construire l'URL correctement avec l'id", () => {
      service.getById('abc-123').subscribe();
      const req = httpMock.expectOne((r) => r.url.includes('abc-123'));
      expect(req.request.url).toContain('abc-123');
      req.flush(mockAlbum);
    });
  });

  describe('create()', () => {
    it('devrait créer un album via POST', () => {
      const newAlbum: AlbumCreateDTO = {
        nom: 'Nevermind', interprete: 'Nirvana', dateSortie: '1991-09-24',
        nombrePistes: 13, note: 4, imageURL: '', genre: 'Rock',
      };
      service.create(newAlbum).subscribe((album) => {
        expect(album).toEqual({ id: '3', ...newAlbum });
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAlbum);
      req.flush({ id: '3', ...newAlbum });
    });
  });

  describe('update()', () => {
    it('devrait mettre à jour un album via PUT', () => {
      const update: AlbumUpdateDTO = { note: 3, nom: 'Dark Side' };
      service.update('1', update).subscribe((album) => {
        expect(album.note).toBe(3);
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums/1'));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(update);
      req.flush({ ...mockAlbum, ...update });
    });
  });

  describe('delete()', () => {
    it('devrait supprimer un album via DELETE', () => {
      service.delete('1').subscribe((response) => {
        expect(response.message).toBe('Album supprimé');
      });
      const req = httpMock.expectOne((r) => r.url.endsWith('/albums/1'));
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Album supprimé' });
    });
  });
});
