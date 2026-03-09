import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blabla } from './blabla';

describe('Blabla', () => {
  let component: Blabla;
  let fixture: ComponentFixture<Blabla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Blabla],
    }).compileComponents();

    fixture = TestBed.createComponent(Blabla);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
