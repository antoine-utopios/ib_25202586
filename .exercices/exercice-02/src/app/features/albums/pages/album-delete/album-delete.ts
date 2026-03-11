import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-delete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-delete.html',
  styleUrls: ['./album-delete.scss']
})
export class AlbumDeleteComponent implements OnInit {
  album = signal<Album | null>(null);
  isLoading = signal(true);
  isDeleting = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  confirmDelete(): void {
    if (!this.album()) return;
    this.isDeleting.set(true);
    this.albumService.delete(this.album()!.id).subscribe({
      next: () => {
        this.router.navigate(['/album']);
      },
      error: () => {
        this.error.set('Erreur lors de la suppression.');
        this.isDeleting.set(false);
      }
    });
  }

  getImageUrl(url: string): string {
    return url || 'https://media.istockphoto.com/id/481475560/vector/vinyl-record-template.jpg?s=612x612&w=0&k=20&c=fZgBryspxNnRn8qMa1mEquff_T6wENAY1HXMtNEMyh4=';
  }

  getStars(note: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(note));
  }
}
