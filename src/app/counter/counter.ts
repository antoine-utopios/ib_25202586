import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Counter {
  public readonly firstName$ = new BehaviorSubject<string>('John');
  public readonly lastName$ = new BehaviorSubject<string>('DOE');
  public readonly firstNameSignal = signal('John');
  public readonly lastNameSignal = signal('DOE');
  public readonly counterSignal = signal(0);
  // public readonly userSignal = signal<User | null>(null);

  public readonly fullNameComputed = computed(() => this.firstNameSignal() + ' ' + this.lastNameSignal())

  // SIGNAL<string> DOE
}
