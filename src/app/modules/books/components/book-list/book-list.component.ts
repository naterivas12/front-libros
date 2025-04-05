import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient) {
    this.loadAuthors();
  }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.http.get<Book[]>(`${this.apiUrl}/books`).subscribe(
      (books) => {
        this.books = books;
        this.filterBooks();
        this.calculatePagination();
      },
      (error) => console.error('Error loading books:', error)
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
          this.loadBooks();
          this.closeModal();
        },
        (error) => console.error('Error updating book:', error)
      );
    } else {
      this.http.post(`${this.apiUrl}/books`, book).subscribe(
        () => {
          this.loadBooks();
          this.closeModal();
        },
        (error) => console.error('Error creating book:', error)
      );
    }
  }

  deleteBook(id: string) {
    if (confirm('¿Está seguro de eliminar este libro?')) {
      this.http.delete(`${this.apiUrl}/books/${id}`).subscribe(
        () => {
          this.loadBooks();
        },
        (error) => console.error('Error deleting book:', error)
      );
    }
  }

  onNewAuthor() {
    this.showAuthorModal = true;
  }

  saveAuthor(author: Author) {
    this.http.post(`${this.apiUrl}/authors`, author).subscribe(
      () => {
        this.loadAuthors();
        this.closeAuthorModal();
      },
      (error) => console.error('Error creating author:', error)
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
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.filteredBooks.length / itemsPerPage);
  }

  // Getter para obtener los libros de la página actual
  get paginatedBooks(): Book[] {
    const itemsPerPage = 10;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    return this.filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }

  // Método para detectar cambios en la búsqueda
  onSearch() {
    this.currentPage = 1; // Resetear a la primera página
    this.filterBooks();
  }
}
