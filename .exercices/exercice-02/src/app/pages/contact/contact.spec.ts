import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ContactComponent } from './contact';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec des valeurs vides', () => {
    expect(component.form.name).toBe('');
    expect(component.form.email).toBe('');
    expect(component.form.message).toBe('');
  });

  it('devrait initialiser sent à false', () => {
    expect(component.sent).toBe(false);
  });

  it('ne devrait pas envoyer si le nom est vide', () => {
    component.form = { name: '', email: 'test@test.com', message: 'Hello' };
    component.send();
    expect(component.sent).toBe(false);
  });

  it("ne devrait pas envoyer si l'email est vide", () => {
    component.form = { name: 'Alice', email: '', message: 'Hello' };
    component.send();
    expect(component.sent).toBe(false);
  });

  it('ne devrait pas envoyer si le message est vide', () => {
    component.form = { name: 'Alice', email: 'alice@test.com', message: '' };
    component.send();
    expect(component.sent).toBe(false);
  });

  it('devrait passer sent à true si tous les champs sont remplis', () => {
    component.form = { name: 'Alice', email: 'alice@test.com', message: 'Bonjour !' };
    component.send();
    expect(component.sent).toBe(true);
  });
});
