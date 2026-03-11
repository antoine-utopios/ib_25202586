import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "À propos"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('propos');
  });

  it('devrait afficher 3 cartes about', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.about-card');
    expect(cards.length).toBe(3);
  });

  it('devrait afficher la section "Notre mission"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h3'));
    expect(headings.some(h => h.textContent?.includes('mission'))).toBe(true);
  });

  it('devrait afficher la section "Notre vision"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h3'));
    expect(headings.some(h => h.textContent?.includes('vision'))).toBe(true);
  });

  it('devrait afficher la section "Notre technologie"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h3'));
    expect(headings.some(h => h.textContent?.includes('technologie'))).toBe(true);
  });

  it('devrait afficher 3 statistiques', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const stats = compiled.querySelectorAll('.stat');
    expect(stats.length).toBe(3);
  });
});
