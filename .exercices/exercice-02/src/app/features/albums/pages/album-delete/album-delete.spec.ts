import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlbumDeleteComponent } from './album-delete';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

const mockAlbum: Album = {
  id: '1', nom: 'Dark Side of the Moon', interprete: 'Pink Floyd',
  dateSortie: '1973-03-01', nombrePistes: 10, note: 5,
  imageURL: 'https://example.com/dsotm.jpg', genre: 'Rock',
};

describe('AlbumDeleteComponent', () => {
  let component: AlbumDeleteComponent;
  let fixture: ComponentFixture<AlbumDeleteComponent>;
  let getByIdSpy: ReturnType<typeof vi.fn>;
  let deleteSpy: ReturnType<typeof vi.fn>;
  let router: Router;

  const setup = async (id: string | null = '1', getByIdReturn = of(mockAlbum)) => {
    getByIdSpy = vi.fn().mockReturnValue(getByIdReturn);
    deleteSpy = vi.fn().mockReturnValue(of({ message: 'Supprimé' }));

    await TestBed.configureTestingModule({
      imports: [AlbumDeleteComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: { getById: getByIdSpy, delete: deleteSpy } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('devrait être créé', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it("devrait charger l'album si l'id est présent", async () => {
    await setup();
    expect(getByIdSpy).toHaveBeenCalledWith('1');
    expect(component.album()).toEqual(mockAlbum);
    expect(component.isLoading()).toBe(false);
  });

  it("ne devrait pas appeler getById si l'id est absent", async () => {
    await setup(null);
    expect(getByIdSpy).not.toHaveBeenCalled();
  });

  it("devrait afficher une erreur si le chargement échoue", async () => {
    await setup('1', throwError(() => new Error('Not found')));
    expect(component.error()).toBe('Album introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it("ne devrait pas supprimer si l'album est null", async () => {
    await setup(null);
    component.confirmDelete();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("devrait appeler delete() et naviguer vers /album", async () => {
    await setup();
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.confirmDelete();
    expect(deleteSpy).toHaveBeenCalledWith('1');
    expect(navigateSpy).toHaveBeenCalledWith(['/album']);
  });

  it("devrait afficher une erreur si delete() échoue", async () => {
    await setup();
    deleteSpy.mockReturnValue(throwError(() => new Error('Delete error')));
    component.confirmDelete();
    expect(component.error()).toBe('Erreur lors de la suppression.');
    expect(component.isDeleting()).toBe(false);
  });

  describe('getImageUrl()', () => {
    beforeEach(() => setup());

    it("devrait retourner l'URL si non vide", () => {
      expect(component.getImageUrl('https://img.com/a.jpg')).toBe('https://img.com/a.jpg');
    });

    it('devrait retourner une image par défaut si vide', () => {
      expect(component.getImageUrl('')).toBeTruthy();
    });
  });

  describe('getStars()', () => {
    beforeEach(() => setup());

    it('devrait retourner 5 éléments', () => {
      expect(component.getStars(3).length).toBe(5);
    });

    it('devrait avoir le bon nombre détoiles remplies', () => {
      expect(component.getStars(2).filter(Boolean).length).toBe(2);
    });
  });
});
