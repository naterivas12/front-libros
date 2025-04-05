import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AuthorModalComponent } from './components/author-modal/author-modal.component';
import { BookModalComponent } from './components/book-modal/book-modal.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';

@NgModule({
  declarations: [
    PaginationComponent,
    AuthorModalComponent,
    BookModalComponent,
    SkeletonComponent
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
    AuthorModalComponent,
    BookModalComponent,
    SkeletonComponent
  ],
})
export class SharedModule {}
