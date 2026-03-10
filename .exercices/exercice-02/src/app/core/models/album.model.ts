export interface Album {
  id: string;
  nom: string;
  interprete: string;
  dateSortie: string;
  nombrePistes: number;
  note: number;
  imageURL: string;
  genre: string;
}

export type AlbumCreateDTO = Omit<Album, 'id'>;
export type AlbumUpdateDTO = Partial<AlbumCreateDTO>;
