import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { type TodoData } from './result.model';
import { catchError, of } from 'rxjs';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/';

@Component({
  selector: 'app-test-http',
  imports: [],
  templateUrl: './test-http.html',
  styleUrl: './test-http.css',
})
export class TestHttp {
  // private httpClient: HttpClient;

  // constructor(httpClient: HttpClient) {
  //   this.httpClient = httpClient;
  // }

  // constructor(private httpClient: HttpClient) { }

  private httpClient: HttpClient = inject(HttpClient);

  todos = signal<TodoData[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  getAllTodos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.todos.set([]);

    this.httpClient.get<TodoData[]>(BASE_URL).subscribe({
      next: (data) => {
        this.todos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error.message)
        this.isLoading.set(false);
      }
    });
  }
}
