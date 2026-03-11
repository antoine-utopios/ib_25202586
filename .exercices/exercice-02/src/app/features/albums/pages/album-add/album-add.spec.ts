import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlbumAddComponent } from './album-add';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

const mockCreatedAlbum: Album = {
  id: '10', nom: 'Nevermind', interprete: 'Nirvana',
  dateSortie: '1991-09-24', nombrePistes: 13, note: 4, imageURL: '', genre: 'Rock',
};

describe('AlbumAddComponent', () => {
  let component: AlbumAddComponent;
  let fixture: ComponentFixture<AlbumAddComponent>;
  let createSpy: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    createSpy = vi.fn().mockReturnValue(of(mockCreatedAlbum));

    await TestBed.configureTestingModule({
      imports: [AlbumAddComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: { create: createSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec les valeurs par défaut', () => {
    expect(component.form.get('nom')?.value).toBe('');
    expect(component.form.get('note')?.value).toBe(0);
    expect(component.form.get('nombrePistes')?.value).toBe(1);
  });

  it('devrait être invalide à la création (champs requis vides)', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('devrait être valide si tous les champs requis sont remplis', () => {
    component.form.patchValue({ nom: 'Nevermind', interprete: 'Nirvana', dateSortie: '1991-09-24', nombrePistes: 13, note: 4, genre: 'Rock' });
    expect(component.form.valid).toBe(true);
  });

  it("ne devrait pas appeler create() si le formulaire est invalide", () => {
    component.onSubmit();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('devrait appeler create() et naviguer après soumission réussie', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.form.patchValue({ nom: 'Nevermind', interprete: 'Nirvana', dateSortie: '1991-09-24', nombrePistes: 13, note: 4, genre: 'Rock' });
    component.onSubmit();
    expect(createSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/album', '10']);
  });

  it("devrait afficher une erreur si create() échoue", () => {
    createSpy.mockReturnValue(throwError(() => new Error('API error')));
    component.form.patchValue({ nom: 'Test', interprete: 'Artiste', dateSortie: '2020-01-01', nombrePistes: 5, note: 3, genre: 'Pop' });
    component.onSubmit();
    expect(component.error()).toBeTruthy();
    expect(component.isSaving()).toBe(false);
  });

  it('devrait exposer les contrôles via getter f', () => {
    expect(component.f['nom']).toBeTruthy();
    expect(component.f['genre']).toBeTruthy();
  });

  it('devrait avoir une liste de genres non vide avec Rock et Pop', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(component.genres).toContain('Rock');
    expect(component.genres).toContain('Pop');
  });

  it('devrait rejeter une note > 5', () => {
    component.form.get('note')?.setValue(6);
    expect(component.form.get('note')?.valid).toBe(false);
  });

  it('devrait rejeter un nombre de pistes < 1', () => {
    component.form.get('nombrePistes')?.setValue(0);
    expect(component.form.get('nombrePistes')?.valid).toBe(false);
  });
});
