import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Author } from '../author/author.service';

export interface Book {
  id: string;
  title: string;
  description: string;
  year: number;
  authorId: string;
  published: boolean;
  author?: Author;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/books`;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getBook(id: string): Observable<Book> {
    return this.http
      .get<Book>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(this.apiUrl, book)
      .pipe(catchError(this.handleError));
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this.http
      .put<Book>(`${this.apiUrl}/${id}`, book)
      .pipe(catchError(this.handleError));
  }

  deleteBook(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Se ha producido un error:', error);
    return throwError(() => error);
  }
}
