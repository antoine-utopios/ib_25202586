import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRandomWord } from './display-random-word';
import { WordGenerator } from '../core/word-generator';

import { Mock, vi } from 'vitest';


// vi.mock('../core/word-generator', async () => {
//   const original = await vi.importActual('../core/word-generator');

//   return {
//     ...original,

//     generateFirstName: vi.fn().mockImplementation(() => {
//       return 'Test';
//     })
//   }
// });

// vi.mock('../core/word-generator', () => ({
//   generateFirstName: vi.fn().mockImplementation(() => {
//     return 'Test';
//   })
// })
// );

describe('DisplayRandomWord', () => {
  let component: DisplayRandomWord;
  let fixture: ComponentFixture<DisplayRandomWord>;
  let service: WordGenerator;
  let generateFirstNameSpy: Mock<() => string>;
  // let giveMeHelloSpy: Mock<() => string>;
  // let giveMeFiveSpy: Mock<() => number>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayRandomWord],
    }).compileComponents();

    service = TestBed.inject(WordGenerator);
    generateFirstNameSpy = vi.spyOn(service, 'generateFirstName').mockReturnValue('Test');
    fixture = TestBed.createComponent(DisplayRandomWord);
    component = fixture.componentInstance;
    // giveMeHelloSpy = vi.spyOn(service, 'giveMeHello').mockReturnValue('Test');
    // giveMeFiveSpy = vi.spyOn(service, 'giveMeFive').mockReturnValue(3);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a name in its display, according to what was sent by the service', () => {
    const element = fixture.nativeElement as HTMLElement;
    const spanElement = element.querySelector('span#current-firstname') as HTMLSpanElement;

    expect(spanElement.textContent).toBe('Test')
  });
});
