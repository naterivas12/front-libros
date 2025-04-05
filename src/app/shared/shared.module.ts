import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AuthorModalComponent } from './components/author-modal/author-modal.component';

@NgModule({
  declarations: [
    PaginationComponent,
    AuthorModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    AuthorModalComponent
  ],
})
export class SharedModule {}
