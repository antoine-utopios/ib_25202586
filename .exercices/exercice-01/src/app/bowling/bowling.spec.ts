import { TestBed } from '@angular/core/testing';
import { BowlingComponent } from './bowling';

describe('BowlingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BowlingComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(BowlingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
