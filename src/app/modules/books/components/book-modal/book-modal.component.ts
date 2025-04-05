import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
}

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html'
})
export class BookModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() editMode = false;
  @Input() book: Book | null = null;
  @Input() authors: Author[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Book>();

  bookForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1000)]],
      authorId: ['', Validators.required],
      published: [false]
    });
  }

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    if (this.book) {
      this.bookForm.patchValue(this.book);
    } else {
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.bookForm.valid) {
      this.save.emit(this.bookForm.value);
    }
  }

  private resetForm() {
    this.bookForm.reset({
      id: '',
      title: '',
      description: '',
      year: '',
      authorId: '',
      published: false
    });
  }
}
