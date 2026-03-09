import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDisplay } from './simple-display';

describe('SimpleDisplay', () => {
  let component: SimpleDisplay;
  let fixture: ComponentFixture<SimpleDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
