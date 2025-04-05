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
  templateUrl: './book-modal.component.html',
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 1040;
    }
    .modal {
      z-index: 1050;
    }
  `]
})
export class BookModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() editMode = false;
  @Input() book: Book | null = null;
  @Input() authors: Author[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Book>();
  @Output() newAuthor = new EventEmitter<void>();

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

  onNewAuthor() {
    this.newAuthor.emit();
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
