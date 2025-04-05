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
  authors: Author[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  showModal = false;
  editMode = false;
  selectedBook: Book | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
    this.loadAuthors();
  }

  loadBooks() {
    this.http.get<Book[]>(`${this.apiUrl}/books`).subscribe(books => {
      this.books = books;
      this.calculatePagination();
    });
  }

  loadAuthors() {
    this.http.get<Author[]>(`${this.apiUrl}/authors`).subscribe(authors => {
      this.authors = authors;
    });
  }

  openNewBookModal() {
    this.editMode = false;
    this.selectedBook = null;
    this.showModal = true;
  }

  editBook(book: Book) {
    this.editMode = true;
    this.selectedBook = book;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBook = null;
  }

  saveBook(book: Book) {
    if (this.editMode) {
      this.http.put(`${this.apiUrl}/books/${book.id}`, book).subscribe(() => {
        this.loadBooks();
        this.closeModal();
      });
    } else {
      this.http.post(`${this.apiUrl}/books`, book).subscribe(() => {
        this.loadBooks();
        this.closeModal();
      });
    }
  }

  deleteBook(id: string) {
    if (confirm('¿Está seguro de eliminar este libro?')) {
      this.http.delete(`${this.apiUrl}/books/${id}`).subscribe(() => {
        this.loadBooks();
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  private calculatePagination() {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.books.length / itemsPerPage);
  }
}
