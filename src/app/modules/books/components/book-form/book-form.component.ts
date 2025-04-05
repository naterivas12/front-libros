import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../../../shared/interfaces/book.interface';
import { Author } from '../../../../shared/services/author/author.service';
import { AuthorService } from '../../../../shared/services/author/author.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() save = new EventEmitter<Book>();
  @Output() cancel = new EventEmitter<void>();

  bookForm: FormGroup;
  authors: Author[] = [];

  constructor(private fb: FormBuilder, private authorService: AuthorService) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(2024)],
      ],
      authorId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAuthors();
    if (this.book) {
      this.bookForm.patchValue(this.book);
    }
  }

  private loadAuthors(): void {
    this.authorService.getAuthors().subscribe(
      (authors) => (this.authors = authors),
      (error) => console.error('Error loading authors:', error)
    );
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;
      if (this.book?.id) {
        bookData.id = this.book.id;
      }
      this.save.emit(bookData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
