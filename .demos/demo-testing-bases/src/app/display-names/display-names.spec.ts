import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DisplayNames } from './display-names';
import { Name } from '../core/name';

describe('DisplayNames', () => {
  let component: DisplayNames;
  let fixture: ComponentFixture<DisplayNames>;
  let service: Name;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayNames],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayNames);
    component = fixture.componentInstance;
    service = TestBed.inject(Name);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change fullName value to expected result', () => {
    // Arrange
    const NEW_NAME = 'Martha DUPONT';
    const element = fixture.nativeElement as HTMLElement;
    const fullNameStrong = element.querySelector('strong#fullname-value') as HTMLElement;
    const changeNameButton = element.querySelector('button#change-name') as HTMLButtonElement;
    const modifyFullNameSpy = vi.spyOn(component, 'modifyFullName');
    const changeFullNameSpy = vi.spyOn(service, 'changeFullName');

    // Act
    changeNameButton.click();
    fixture.detectChanges();

    // Assert
    expect(modifyFullNameSpy).toHaveBeenCalledWith(NEW_NAME);
    expect(changeFullNameSpy).toHaveBeenCalledWith(NEW_NAME);
    expect(fullNameStrong.textContent).toBe(NEW_NAME);
  })
});
