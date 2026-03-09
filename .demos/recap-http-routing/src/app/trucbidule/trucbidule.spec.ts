import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trucbidule } from './trucbidule';

describe('Trucbidule', () => {
  let component: Trucbidule;
  let fixture: ComponentFixture<Trucbidule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trucbidule],
    }).compileComponents();

    fixture = TestBed.createComponent(Trucbidule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
