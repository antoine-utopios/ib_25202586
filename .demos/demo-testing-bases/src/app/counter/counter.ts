import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  public readonly counterValue = signal(5);


  decrement(value: number) {
    this.counterValue.update(oldValue => oldValue - value);
  }

  increment(value: number) {
    this.counterValue.update(oldValue => oldValue + value);
  }
}
