import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre principal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('collection musicale');
  });

  it('devrait afficher le badge hero', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero__badge')?.textContent).toContain('discothèque numérique');
  });

  it('devrait afficher 3 feature cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.feature-card');
    expect(cards.length).toBe(3);
  });

  it('devrait afficher le lien vers la liste des albums', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const albumLink = Array.from(links).find(l => l.getAttribute('href') === '/album');
    expect(albumLink).toBeTruthy();
  });

  it('devrait afficher le lien pour ajouter un album', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const addLinks = Array.from(links).filter(l => l.getAttribute('href') === '/album/add');
    expect(addLinks.length).toBeGreaterThan(0);
  });

  it('devrait afficher la section CTA', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cta')).toBeTruthy();
  });
});
