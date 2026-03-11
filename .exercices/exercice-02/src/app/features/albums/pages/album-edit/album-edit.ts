import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './album-edit.html',
  styleUrls: ['./album-edit.scss']
})
export class AlbumEditComponent implements OnInit {
  form!: FormGroup;
  album = signal<Album | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  error = signal<string | null>(null);

  genres = ['Rock', 'Pop', 'Jazz', 'Hip-Hop', 'Electronic', 'Classical', 'Metal', 'R&B', 'Country', 'Folk', 'Blues', 'Reggae', 'Autre'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.albumService.getById(id).subscribe({
        next: (album) => {
          this.album.set(album);
          this.form.patchValue(album);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Album introuvable.');
          this.isLoading.set(false);
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(1)]],
      interprete: ['', Validators.required],
      dateSortie: ['', Validators.required],
      nombrePistes: [1, [Validators.required, Validators.min(1)]],
      note: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      imageURL: [''],
      genre: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.album()) return;
    this.isSaving.set(true);
    this.error.set(null);
    this.albumService.update(this.album()!.id, this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/album', this.album()!.id]);
      },
      error: () => {
        this.error.set('Erreur lors de la mise à jour.');
        this.isSaving.set(false);
      }
    });
  }

  get f() { return this.form.controls; }
}
