import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../services/book/book.service';
import { Author, AuthorService } from '../../services/author/author.service';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
})
export class BookModalComponent {
  @Input() show = false;
  @Input() editMode = false;
  @Input() book: Book | null = null;
  @Input() authors: Author[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Book>();
  @Output() authorCreated = new EventEmitter<Author>();

  bookForm: FormGroup;
  showAuthorModal = false;

  constructor(private fb: FormBuilder, private authorService: AuthorService) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      year: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(9999)],
      ],
      authorId: ['', [Validators.required]],
      published: [false],
    });
  }

  ngOnChanges() {
    if (this.book && this.editMode) {
      this.bookForm.patchValue({
        title: this.book.title,
        description: this.book.description,
        year: this.book.year,
        authorId: this.book.authorId,
        published: this.book.published,
      });
    } else {
      this.bookForm.reset({
        published: false,
      });
    }
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;
      if (this.editMode && this.book) {
        bookData.id = this.book.id;
      }
      this.save.emit(bookData);
    }
  }

  onClose() {
    this.close.emit();
  }

  onNewAuthor() {
    this.showAuthorModal = true;
  }

  closeAuthorModal() {
    this.showAuthorModal = false;
  }

  saveAuthor(author: Author) {
    this.authorService.createAuthor(author).subscribe(
      (newAuthor) => {
        this.authorCreated.emit(newAuthor);
        this.closeAuthorModal();
      },
      (error) => console.error('Error creating author:', error)
    );
  }
}
