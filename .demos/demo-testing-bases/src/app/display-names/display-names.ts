import { Component, inject } from '@angular/core';
import { Name } from '../core/name';

@Component({
  selector: 'app-display-names',
  imports: [],
  templateUrl: './display-names.html',
  styleUrl: './display-names.scss',
})
export class DisplayNames {
  public readonly nameService = inject(Name);

  modifyFullName(value: string) {
    this.nameService.changeFullName(value);
  }
}
