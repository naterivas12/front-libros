import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../../../../shared/services/author/author.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
})
export class AuthorFormComponent implements OnInit {
  @Input() author: Author | null = null;
  @Output() save = new EventEmitter<Author>();
  @Output() cancel = new EventEmitter<void>();

  authorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authorForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      biography: ['', Validators.required],
      birthDate: ['', [Validators.required, this.futureDateValidator]],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.author) {
      this.authorForm.patchValue(this.author);
    }
  }

  futureDateValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate > today ? { futureDate: true } : null;
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      const authorData = this.authorForm.value;
      if (this.author?.id) {
        authorData.id = this.author.id;
      }
      this.save.emit(authorData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
