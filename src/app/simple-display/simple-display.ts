import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-simple-display',
  imports: [],
  templateUrl: './simple-display.html',
  styleUrl: './simple-display.css',
})
export class SimpleDisplay {
  @Input({ required: true }) textFromParent!: string;
  textFromParentSignal = input.required<string>();
}
