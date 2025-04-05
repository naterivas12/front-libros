import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Author {
  id: string;
  name: string;
  gender: string;
}

@Component({
  selector: 'app-author-modal',
  template: `
    <div class="modal-backdrop fade show" *ngIf="show"></div>
    <div class="modal d-block fade" [ngClass]="{'show': show}" *ngIf="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Editar Autor' : 'Nuevo Autor' }}</h5>
            <button type="button" class="btn-close" (click)="onClose()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="authorForm">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" formControlName="name">
              </div>
              <div class="mb-3">
                <label class="form-label">Género</label>
                <select class="form-control" formControlName="gender">
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onClose()">Cancelar</button>
            <button type="button" class="btn btn-primary" (click)="onSave()">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  `,
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
export class AuthorModalComponent {
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
