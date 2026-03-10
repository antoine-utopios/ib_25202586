import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

export interface TodoData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-display-todos',
  imports: [],
  templateUrl: './display-todos.html',
  styleUrl: './display-todos.scss',
})
export class DisplayTodos implements OnInit {
  readonly httpClient = inject(HttpClient);

  readonly todos = signal<TodoData[]>([]);

  ngOnInit(): void {
    this.httpClient.get<TodoData[]>('https://jsonplaceholder.typicode.com/todos').subscribe(data => {
      this.todos.set(data);
    });
  }
}
