import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  showModal = false;
  editMode = false;
  selectedAuthor: Author | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAuthors();
  }

  loadAuthors() {
    this.http.get<Author[]>(`${this.apiUrl}/authors`).subscribe(authors => {
      this.authors = authors;
      this.calculatePagination();
    });
  }

  openNewAuthorModal() {
    this.editMode = false;
    this.selectedAuthor = null;
    this.showModal = true;
  }

  editAuthor(author: Author) {
    this.editMode = true;
    this.selectedAuthor = author;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAuthor = null;
  }

  saveAuthor(author: Author) {
    if (this.editMode) {
      this.http.put(`${this.apiUrl}/authors/${author.id}`, author).subscribe(() => {
        this.loadAuthors();
        this.closeModal();
      });
    } else {
      this.http.post(`${this.apiUrl}/authors`, author).subscribe(() => {
        this.loadAuthors();
        this.closeModal();
      });
    }
  }

  deleteAuthor(id: string) {
    if (confirm('¿Está seguro de eliminar este autor?')) {
      this.http.delete(`${this.apiUrl}/authors/${id}`).subscribe(() => {
        this.loadAuthors();
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  private calculatePagination() {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.authors.length / itemsPerPage);
  }
}
