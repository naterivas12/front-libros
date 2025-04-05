import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { AuthorModalComponent } from './components/author-modal/author-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorListComponent
  }
];

@NgModule({
  declarations: [
    AuthorListComponent,
    AuthorModalComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthorsModule { }
