import { Injectable } from '@angular/core';

export const AVAILABLE_FIRSTNAMES = ['Antoine', 'Ihab', 'Martha', 'MArine', 'John'];

@Injectable({
  providedIn: 'root',
})
export class WordGenerator {
  generateFirstName() {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_FIRSTNAMES.length);
    return AVAILABLE_FIRSTNAMES[randomIndex];
  }

  giveMeHello() {
    return 'Hello world';
  }

  giveMeFive() {
    return 5;
  }
}
