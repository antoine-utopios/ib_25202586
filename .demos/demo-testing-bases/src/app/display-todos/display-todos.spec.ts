import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTodos } from './display-todos';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

// vi.mock('@angular/common/http', async () => {
//   const original = await vi.importActual('@angular/common/http');

//   return {
//     ...original,
//
//     HttpClient: {
//          get: vi.fn().mockImplementation(() => {
//             return 'Test';
//          })
//      }
//   }
// });


describe('DisplayTodos', () => {
  let component: DisplayTodos;
  let fixture: ComponentFixture<DisplayTodos>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTodos],
      providers: [
        provideHttpClientTesting()
        // HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayTodos);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sent a request at startup', () => {
    fixture.detectChanges();

    httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
  })

  it('should display the correct amount of <li> elements based on the number of todo(s) received', async () => {
    const request = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(request.request.method).toBe('GET');

    // const webToken = 'token';
    // expect(request.request.headers.get('Authorization')).toBe(webToken);

    request.flush([
      {
        userId: 1,
        id: 1,
        title: 'Todo A',
        completed: false
      },
      {
        userId: 1,
        id: 2,
        title: 'Todo B',
        completed: false
      },
      {
        userId: 1,
        id: 3,
        title: 'Todo C',
        completed: false
      }
    ])

    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const ulElement = element.querySelector('ul#todos_listing') as HTMLUListElement;

    expect(ulElement.children.length).toBe(3);
  })

});
