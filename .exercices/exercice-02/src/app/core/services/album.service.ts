import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album, AlbumCreateDTO, AlbumUpdateDTO } from '../models/album.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private readonly apiUrl = `${environment.apiUrl}/albums`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  getById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  create(album: AlbumCreateDTO): Observable<Album> {
    return this.http.post<Album>(this.apiUrl, album);
  }

  update(id: string, album: AlbumUpdateDTO): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/${id}`, album);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
