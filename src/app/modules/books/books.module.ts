import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookModalComponent } from './components/book-modal/book-modal.component';

const routes: Routes = [
  {
    path: '',
    component: BookListComponent,
  },
];

@NgModule({
  declarations: [BookListComponent, BookModalComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class BooksModule {}
