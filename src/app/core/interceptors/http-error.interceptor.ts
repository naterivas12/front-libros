import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error';
        
        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMessage = `Error ${error.status}: ${error.message}`;
        }
        
        this.messageService.showError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
