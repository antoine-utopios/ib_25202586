import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Name {
  public readonly fullName = signal('John Doe');

  changeFullName(value: string) {
    this.fullName.set(value);
  }
}
