import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Counter } from './counter';

describe('Counter', () => {
  let component: Counter;
  let fixture: ComponentFixture<Counter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Counter],
    }).compileComponents();

    fixture = TestBed.createComponent(Counter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit the UI when the counter value has been edited', () => {
    // Arrange
    const element = fixture.nativeElement as HTMLElement;
    const spanElement = element.querySelector('span#current-value') as HTMLSpanElement;

    // Act
    component.counterValue.set(8);
    fixture.detectChanges();

    // Assert
    expect(spanElement.textContent).toBe("8");
  });

  it('should trigger the decrement() function with the correct value when pressing the decrement button while above the threshold value', () => {
    // Arrange
    const element = fixture.nativeElement as HTMLElement;
    const decrementButtonElement = element.querySelector('button#decrement') as HTMLButtonElement;
    const spanElement = element.querySelector('span#current-value') as HTMLSpanElement;
    const decrementSpy = vi.spyOn(component, 'decrement');
    component.counterValue.set(1);
    fixture.detectChanges();

    // Act
    decrementButtonElement.click();
    fixture.detectChanges();

    // Assert
    expect(decrementSpy).toHaveBeenCalledWith(1);
    expect(spanElement.textContent).toBe("0");
    expect(decrementButtonElement.className.split(' ')).toContain('btnDisabled');
    expect(decrementButtonElement.disabled).toBeTruthy();
  });

  it('should not trigger the decrement() function with the value of 0 when pressing the decrement button', () => {
    // Arrange
    const element = fixture.nativeElement as HTMLElement;
    const decrementButtonElement = element.querySelector('button#decrement') as HTMLButtonElement;
    const spanElement = element.querySelector('span#current-value') as HTMLSpanElement;
    const decrementSpy = vi.spyOn(component, 'decrement');
    component.counterValue.set(0);
    fixture.detectChanges();

    // Act
    decrementButtonElement.click();
    fixture.detectChanges();

    // Assert
    expect(decrementSpy).not.toHaveBeenCalled();
    expect(spanElement.textContent).toBe("0");
  });

  it('should trigger the decrement() function with the correct value when pressing the decrement button', () => {
    // Arrange
    const element = fixture.nativeElement as HTMLElement;
    const decrementButtonElement = element.querySelector('button#decrement') as HTMLButtonElement;
    const spanElement = element.querySelector('span#current-value') as HTMLSpanElement;
    const decrementSpy = vi.spyOn(component, 'decrement');

    // Act
    decrementButtonElement.click();
    fixture.detectChanges();

    // Assert
    expect(decrementSpy).toHaveBeenCalledWith(1);
    expect(spanElement.textContent).toBe("4");
  });
});
