import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Author {
  id: string;
  name: string;
  gender: string;
}

@Component({
  selector: 'app-author-modal',
  templateUrl: './author-modal.component.html'
})
export class AuthorModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() editMode = false;
  @Input() author: Author | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Author>();

  authorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authorForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    if (this.author) {
      this.authorForm.patchValue(this.author);
    } else {
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.authorForm.valid) {
      this.save.emit(this.authorForm.value);
    }
  }

  private resetForm() {
    this.authorForm.reset({
      id: '',
      name: '',
      gender: ''
    });
  }
}
