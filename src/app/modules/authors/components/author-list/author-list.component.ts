import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

interface Author {
  id: string;
  name: string;
  gender: string;
}

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html'
})
export class AuthorListComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/api`;

  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  showModal = false;
  editMode = false;
  selectedAuthor: Author | null = null;

  constructor(private http: HttpClient) {
    console.log('AuthorListComponent initialized');
  }

  ngOnInit() {
    console.log('Loading authors...');
    this.loadAuthors();
  }

  loadAuthors() {
    console.log('Making HTTP request to:', `${this.apiUrl}/authors`);
    this.http.get<Author[]>(`${this.apiUrl}/authors`).subscribe(
      (authors) => {
        console.log('Authors received:', authors);
        this.authors = authors;
        this.filterAuthors();
        this.calculatePagination();
      },
      (error) => {
        console.error('Error loading authors:', error);
      }
    );
  }

  filterAuthors() {
    if (!this.searchTerm.trim()) {
      this.filteredAuthors = [...this.authors];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredAuthors = this.authors.filter(author => 
        author.name.toLowerCase().includes(search) ||
        author.gender.toLowerCase().includes(search)
      );
    }
    this.calculatePagination();
  }

  openNewAuthorModal() {
    this.editMode = false;
    this.selectedAuthor = null;
    this.showModal = true;
  }

  editAuthor(author: Author) {
    this.editMode = true;
    this.selectedAuthor = { ...author };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAuthor = null;
  }

  saveAuthor(author: Author) {
    if (this.editMode && author.id) {
      this.http.put(`${this.apiUrl}/authors/${author.id}`, author).subscribe(
        () => {
          Swal.fire(
            '¡Actualizado!',
            'El autor ha sido actualizado exitosamente.',
            'success'
          );
          this.loadAuthors();
          this.closeModal();
        },
        (error) => {
          Swal.fire(
            'Error',
            'No se pudo actualizar el autor.',
            'error'
          );
          console.error('Error updating author:', error);
        }
      );
    } else {
      this.http.post(`${this.apiUrl}/authors`, author).subscribe(
        () => {
          Swal.fire(
            '¡Guardado!',
            'El autor ha sido guardado exitosamente.',
            'success'
          );
          this.loadAuthors();
          this.closeModal();
        },
        (error) => {
          Swal.fire(
            'Error',
            'No se pudo guardar el autor.',
            'error'
          );
          console.error('Error creating author:', error);
        }
      );
    }
  }

  deleteAuthor(id: string) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede revertir. Los libros asociados a este autor quedarán sin autor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/authors/${id}`).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              'El autor ha sido eliminado.',
              'success'
            );
            this.loadAuthors();
          },
          (error) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el autor.',
              'error'
            );
            console.error('Error deleting author:', error);
          }
        );
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  private calculatePagination() {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.filteredAuthors.length / itemsPerPage);
  }

  // Getter para obtener los autores de la página actual
  get paginatedAuthors(): Author[] {
    const itemsPerPage = 10;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    return this.filteredAuthors.slice(startIndex, startIndex + itemsPerPage);
  }

  // Método para detectar cambios en la búsqueda
  onSearch() {
    this.currentPage = 1; // Resetear a la primera página
    this.filterAuthors();
  }
}
