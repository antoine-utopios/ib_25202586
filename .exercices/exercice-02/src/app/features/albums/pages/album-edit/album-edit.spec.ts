import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlbumEditComponent } from './album-edit';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

const mockAlbum: Album = {
  id: '1', nom: 'Dark Side of the Moon', interprete: 'Pink Floyd',
  dateSortie: '1973-03-01', nombrePistes: 10, note: 5,
  imageURL: 'https://example.com/dsotm.jpg', genre: 'Rock',
};

describe('AlbumEditComponent', () => {
  let component: AlbumEditComponent;
  let fixture: ComponentFixture<AlbumEditComponent>;
  let getByIdSpy: ReturnType<typeof vi.fn>;
  let updateSpy: ReturnType<typeof vi.fn>;
  let router: Router;

  const setup = async (id: string | null = '1', getByIdReturn = of(mockAlbum)) => {
    getByIdSpy = vi.fn().mockReturnValue(getByIdReturn);
    updateSpy = vi.fn().mockReturnValue(of(mockAlbum));

    await TestBed.configureTestingModule({
      imports: [AlbumEditComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: { getById: getByIdSpy, update: updateSpy } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('devrait être créé', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it("devrait charger l'album et préremplir le formulaire", async () => {
    await setup();
    expect(getByIdSpy).toHaveBeenCalledWith('1');
    expect(component.album()).toEqual(mockAlbum);
    expect(component.form.get('nom')?.value).toBe(mockAlbum.nom);
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

  it("ne devrait pas soumettre si le formulaire est invalide", async () => {
    await setup();
    component.form.get('nom')?.setValue('');
    component.onSubmit();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("ne devrait pas soumettre si l'album n'est pas chargé", async () => {
    await setup(null);
    component.form.patchValue({ nom: 'Test', interprete: 'X', dateSortie: '2020-01-01', nombrePistes: 1, note: 3, genre: 'Pop' });
    component.onSubmit();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('devrait appeler update() et naviguer après soumission réussie', async () => {
    await setup();
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSubmit();
    expect(updateSpy).toHaveBeenCalledWith('1', expect.any(Object));
    expect(navigateSpy).toHaveBeenCalledWith(['/album', '1']);
  });

  it("devrait afficher une erreur si update() échoue", async () => {
    await setup();
    updateSpy.mockReturnValue(throwError(() => new Error('Update error')));
    component.onSubmit();
    expect(component.error()).toBe('Erreur lors de la mise à jour.');
    expect(component.isSaving()).toBe(false);
  });

  it('devrait exposer les contrôles via getter f', async () => {
    await setup();
    expect(component.f['nom']).toBeTruthy();
    expect(component.f['genre']).toBeTruthy();
  });
});
