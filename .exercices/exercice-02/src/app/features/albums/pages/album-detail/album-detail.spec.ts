import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlbumDetailComponent } from './album-detail';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

const mockAlbum: Album = {
  id: '1', nom: 'Dark Side of the Moon', interprete: 'Pink Floyd',
  dateSortie: '1973-03-01', nombrePistes: 10, note: 5,
  imageURL: 'https://example.com/dsotm.jpg', genre: 'Rock',
};

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let getByIdSpy: ReturnType<typeof vi.fn>;

  const setup = async (id: string | null = '1', returnValue = of(mockAlbum)) => {
    getByIdSpy = vi.fn().mockReturnValue(returnValue);

    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: { getById: getByIdSpy } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
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

  describe('getStars()', () => {
    beforeEach(() => setup());

    it('devrait retourner 5 éléments', () => {
      expect(component.getStars(3).length).toBe(5);
    });

    it('devrait avoir le bon nombre détoiles remplies', () => {
      expect(component.getStars(4).filter(Boolean).length).toBe(4);
    });
  });

  describe('getImageUrl()', () => {
    beforeEach(() => setup());

    it("devrait retourner l'URL si non vide", () => {
      expect(component.getImageUrl('https://test.com/img.jpg')).toBe('https://test.com/img.jpg');
    });

    it('devrait retourner une image par défaut si vide', () => {
      expect(component.getImageUrl('')).toBeTruthy();
    });
  });
});
