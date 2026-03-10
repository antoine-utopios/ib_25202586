import { Component, OnInit } from '@angular/core';
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
  album: Album | null = null;
  isLoading = true;
  isDeleting = false;
  error: string | null = null;

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
          this.album = album;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Album introuvable.';
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(): void {
    if (!this.album) return;
    this.isDeleting = true;
    this.albumService.delete(this.album.id).subscribe({
      next: () => {
        this.router.navigate(['/album']);
      },
      error: () => {
        this.error = 'Erreur lors de la suppression.';
        this.isDeleting = false;
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
