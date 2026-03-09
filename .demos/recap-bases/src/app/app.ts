import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from './counter/counter';
import { Subscription } from 'rxjs';
import { SimpleDisplay } from './simple-display/simple-display';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SimpleDisplay],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  firstNameSub!: Subscription;
  lastNameSub!: Subscription;
  firstNameDisplay = '';
  firstNameDisplayFromSignal = '';
  fullNameDisplay = '';
  fullNameDisplayFromSignal = '';
  private readonly counterService: Counter;


  constructor(counterService: Counter) {
    this.counterService = counterService;
    this.firstNameDisplayFromSignal = this.counterService.firstNameSignal();
    this.fullNameDisplayFromSignal = this.counterService.fullNameComputed();
  }

  ngOnInit(): void {
    this.firstNameSub = this.counterService.firstName$.subscribe(newValue => {
      this.firstNameDisplay = newValue;
      this.fullNameDisplay = newValue + ' ' + this.counterService.lastName$.value;
    })

    this.lastNameSub = this.counterService.lastName$.subscribe(newValue => {
      this.fullNameDisplay = this.counterService.firstName$.value + ' ' + newValue;
    })
  }

  ngOnDestroy(): void {
    this.firstNameSub?.unsubscribe();
    this.lastNameSub?.unsubscribe();
  }

  editSubjectValue() {
    this.counterService.firstName$.next('Martha');
  }

  editSignalValue() {
    this.counterService.firstNameSignal.set('Martha');
  }

  increment() {
    // this.counterSignal.set(this.counterSignal() + 1);
    this.counterService.counterSignal.update(oldValue => oldValue + 1);
  }


  // constructor(private http: HttpClient) {}
}
