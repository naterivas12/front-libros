import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

interface Author {
  id: string;
  name: string;
  gender: string;
}

interface Book {
  id: string;
  title: string;
  description: string;
  year: number;
  authorId: string;
  published: boolean;
  author?: Author;
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/api`;

  books: Book[] = [];
  filteredBooks: Book[] = [];
  authors: Author[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  showModal = false;
  showAuthorModal = false;
  editMode = false;
  selectedBook: Book | null = null;
  loading = true;

  constructor(private http: HttpClient) {
    this.loadAuthors();
  }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.http.get<Book[]>(`${this.apiUrl}/books`).subscribe(
      (books) => {
        this.books = books;
        this.filterBooks();
        this.calculatePagination();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    );
  }

  loadAuthors() {
    this.http.get<Author[]>(`${this.apiUrl}/authors`).subscribe(
      (authors) => {
        this.authors = authors;
      },
      (error) => console.error('Error loading authors:', error)
    );
  }

  filterBooks() {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = [...this.books];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.description.toLowerCase().includes(search) ||
        book.year.toString().includes(search)
      );
    }
    this.calculatePagination();
  }

  openNewBookModal() {
    this.editMode = false;
    this.selectedBook = null;
    this.showModal = true;
  }

  editBook(book: Book) {
    this.editMode = true;
    this.selectedBook = { ...book };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBook = null;
  }

  closeAuthorModal() {
    this.showAuthorModal = false;
  }

  saveBook(book: Book) {
    if (this.editMode && book.id) {
      this.http.put(`${this.apiUrl}/books/${book.id}`, book).subscribe(
        () => {
          Swal.fire(
            '¡Actualizado!',
            'El libro ha sido actualizado exitosamente.',
            'success'
          );
          this.loadBooks();
          this.closeModal();
        },
        (error) => {
          Swal.fire(
            'Error',
            'No se pudo actualizar el libro.',
            'error'
          );
          console.error('Error updating book:', error);
        }
      );
    } else {
      this.http.post(`${this.apiUrl}/books`, book).subscribe(
        () => {
          Swal.fire(
            '¡Guardado!',
            'El libro ha sido guardado exitosamente.',
            'success'
          );
          this.loadBooks();
          this.closeModal();
        },
        (error) => {
          Swal.fire(
            'Error',
            'No se pudo guardar el libro.',
            'error'
          );
          console.error('Error creating book:', error);
        }
      );
    }
  }

  deleteBook(id: string) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/books/${id}`).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              'El libro ha sido eliminado.',
              'success'
            );
            this.loadBooks();
          },
          (error) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el libro.',
              'error'
            );
            console.error('Error deleting book:', error);
          }
        );
      }
    });
  }

  onNewAuthor() {
    this.showAuthorModal = true;
  }

  saveAuthor(author: Author) {
    this.http.post(`${this.apiUrl}/authors`, author).subscribe(
      () => {
        Swal.fire(
          '¡Guardado!',
          'El autor ha sido guardado exitosamente.',
          'success'
        );
        this.loadAuthors();
        this.closeAuthorModal();
      },
      (error) => {
        Swal.fire(
          'Error',
          'No se pudo guardar el autor.',
          'error'
        );
        console.error('Error saving author:', error);
      }
    );
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? author.name : 'N/A';
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  private calculatePagination() {
    const itemsPerPage = 6;
    this.totalPages = Math.ceil(this.filteredBooks.length / itemsPerPage);
  }

  // Getter para obtener los libros de la página actual
  get paginatedBooks(): Book[] {
    const itemsPerPage = 6;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    return this.filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }

  // Método para detectar cambios en la búsqueda
  onSearch() {
    this.currentPage = 1; // Resetear a la primera página
    this.filterBooks();
  }
}
