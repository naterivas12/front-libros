import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/api`;
  
  books: Book[] = [];
  authors: Author[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [1];
  
  showModal = false;
  showAuthorModal = false;
  editMode = false;
  
  bookForm: FormGroup;
  authorForm: FormGroup;
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1000)]],
      authorId: ['', Validators.required],
      published: [false]
    });

    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

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
    this.bookForm.reset();
    this.showModal = true;
  }

  openNewAuthorModal() {
    this.authorForm.reset();
    this.showAuthorModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.bookForm.reset();
  }

  closeAuthorModal() {
    this.showAuthorModal = false;
    this.authorForm.reset();
  }

  editBook(book: Book) {
    this.editMode = true;
    this.bookForm.patchValue(book);
    this.showModal = true;
  }

  saveBook() {
    if (this.bookForm.valid) {
      const book = this.bookForm.value;
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
  }

  saveAuthor() {
    if (this.authorForm.valid) {
      const author = this.authorForm.value;
      this.http.post(`${this.apiUrl}/authors`, author).subscribe(() => {
        this.loadAuthors();
        this.closeAuthorModal();
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

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private calculatePagination() {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.books.length / itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
