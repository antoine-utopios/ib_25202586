import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-detail.html',
  styleUrls: ['./album-detail.scss']
})
export class AlbumDetailComponent implements OnInit {
  album = signal<Album | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.albumService.getById(id).subscribe({
        next: (album) => {
          this.album.set(album);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Album introuvable.');
          this.isLoading.set(false);
        }
      });
    }
  }

  getStars(note: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(note));
  }

  getImageUrl(url: string): string {
    return url || 'https://media.istockphoto.com/id/481475560/vector/vinyl-record-template.jpg?s=612x612&w=0&k=20&c=fZgBryspxNnRn8qMa1mEquff_T6wENAY1HXMtNEMyh4=';
  }
}
