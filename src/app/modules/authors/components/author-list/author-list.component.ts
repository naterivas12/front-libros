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
          this.loadAuthors();
          this.closeModal();
        },
        (error) => console.error('Error updating author:', error)
      );
    } else {
      this.http.post(`${this.apiUrl}/authors`, author).subscribe(
        () => {
          this.loadAuthors();
          this.closeModal();
        },
        (error) => console.error('Error creating author:', error)
      );
    }
  }

  deleteAuthor(id: string) {
    if (confirm('¿Está seguro de eliminar este autor?')) {
      this.http.delete(`${this.apiUrl}/authors/${id}`).subscribe(
        () => {
          this.loadAuthors();
        },
        (error) => console.error('Error deleting author:', error)
      );
    }
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
