import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlbumListComponent } from './album-list';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

const mockAlbums: Album[] = [
  { id: '1', nom: 'Dark Side of the Moon', interprete: 'Pink Floyd', dateSortie: '1973-03-01', nombrePistes: 10, note: 5, imageURL: 'https://example.com/dsotm.jpg', genre: 'Rock' },
  { id: '2', nom: 'Thriller', interprete: 'Michael Jackson', dateSortie: '1982-11-30', nombrePistes: 9, note: 4, imageURL: '', genre: 'Pop' },
];

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;
  let getAllSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getAllSpy = vi.fn().mockReturnValue(of(mockAlbums));

    await TestBed.configureTestingModule({
      imports: [AlbumListComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: { getAll: getAllSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les albums au démarrage', () => {
    expect(getAllSpy).toHaveBeenCalledTimes(1);
    expect(component.albums()).toEqual(mockAlbums);
  });

  it('devrait désactiver le chargement après réception des albums', () => {
    expect(component.isLoading()).toBe(false);
  });

  it("devrait afficher l'erreur si le chargement échoue", () => {
    getAllSpy.mockReturnValue(throwError(() => new Error('Network error')));
    component.loadAlbums();
    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);
  });

  it("devrait réinitialiser l'erreur avant un rechargement", () => {
    component.error.set('ancienne erreur');
    getAllSpy.mockReturnValue(of(mockAlbums));
    component.loadAlbums();
    expect(component.error()).toBeNull();
  });

  describe('getStars()', () => {
    it('devrait retourner 5 éléments', () => {
      expect(component.getStars(3).length).toBe(5);
    });

    it('devrait marquer les étoiles en dessous de la note', () => {
      const stars = component.getStars(3);
      expect(stars[0]).toBe(true);
      expect(stars[2]).toBe(true);
      expect(stars[3]).toBe(false);
    });

    it('devrait arrondir la note correctement (3.6 → 4)', () => {
      expect(component.getStars(3.6).filter(Boolean).length).toBe(4);
    });

    it('devrait retourner 5 étoiles pour note = 5', () => {
      expect(component.getStars(5).every(Boolean)).toBe(true);
    });

    it('devrait retourner 0 étoiles pour note = 0', () => {
      expect(component.getStars(0).every((s) => !s)).toBe(true);
    });
  });

  describe('getImageUrl()', () => {
    it("devrait retourner l'URL si non vide", () => {
      expect(component.getImageUrl('https://example.com/cover.jpg')).toBe('https://example.com/cover.jpg');
    });

    it('devrait retourner une URL par défaut si vide', () => {
      expect(component.getImageUrl('')).toBeTruthy();
    });
  });
});
