import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser isScrolled à false', () => {
    expect(component.isScrolled).toBe(false);
  });

  it('devrait initialiser isMobileMenuOpen à false', () => {
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('devrait ouvrir le menu mobile sur toggleMobileMenu()', () => {
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);
  });

  it('devrait fermer le menu mobile sur un second toggleMobileMenu()', () => {
    component.toggleMobileMenu();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('devrait fermer le menu mobile sur closeMobileMenu()', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('devrait mettre isScrolled à true si scrollY > 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    component.onScroll();
    expect(component.isScrolled).toBe(true);
  });

  it('devrait remettre isScrolled à false si scrollY <= 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 10, configurable: true });
    component.onScroll();
    expect(component.isScrolled).toBe(false);
  });
});
