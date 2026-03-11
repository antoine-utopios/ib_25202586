import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-list.html',
  styleUrls: ['./album-list.scss']
})
export class AlbumListComponent implements OnInit {
  albums = signal<Album[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private albumService: AlbumService) { }

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.albumService.getAll().subscribe({
      next: (albums) => {
        this.albums.set(albums);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les albums. Vérifiez que l\'API est démarrée.');
        this.isLoading.set(false);
      }
    });
  }

  getStars(note: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(note));
  }

  getImageUrl(url: string): string {
    return url || 'https://media.istockphoto.com/id/481475560/vector/vinyl-record-template.jpg?s=612x612&w=0&k=20&c=fZgBryspxNnRn8qMa1mEquff_T6wENAY1HXMtNEMyh4=';
  }
}
