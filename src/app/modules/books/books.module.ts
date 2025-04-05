import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookModalComponent } from 'src/app/shared/components/book-modal/book-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '', component: BookListComponent
  }
];

@NgModule({
  declarations: [
    BookListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class BooksModule { }
