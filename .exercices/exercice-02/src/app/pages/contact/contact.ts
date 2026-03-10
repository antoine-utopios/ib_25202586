import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  sent = false;

  send(): void {
    if (this.form.name && this.form.email && this.form.message) {
      this.sent = true;
    }
  }
}
