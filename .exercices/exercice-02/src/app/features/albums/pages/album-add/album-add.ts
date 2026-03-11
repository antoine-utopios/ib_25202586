import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlbumService } from '../../../../core/services/album.service';

@Component({
  selector: 'app-album-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './album-add.html',
  styleUrls: ['./album-add.scss']
})
export class AlbumAddComponent {
  form: FormGroup;
  isSaving = signal(false);
  error = signal<string | null>(null);

  genres = ['Rock', 'Pop', 'Jazz', 'Hip-Hop', 'Electronic', 'Classical', 'Metal', 'R&B', 'Country', 'Folk', 'Blues', 'Reggae', 'Autre'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private albumService: AlbumService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      interprete: ['', Validators.required],
      dateSortie: ['', Validators.required],
      nombrePistes: [1, [Validators.required, Validators.min(1)]],
      note: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      imageURL: [''],
      genre: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.error.set(null);
    this.albumService.create(this.form.value).subscribe({
      next: (album) => {
        this.router.navigate(['/album', album.id]);
      },
      error: () => {
        this.error.set('Erreur lors de la création. Vérifiez que l\'API est démarrée.');
        this.isSaving.set(false);
      }
    });
  }

  get f() { return this.form.controls; }
}
