import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { type TodoData } from './result.model';

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

  getAllTodos() {
    this.httpClient.get<TodoData[]>(BASE_URL).subscribe(data => {
      console.log(data);
      console.log(data.length)
    })
  }
}
