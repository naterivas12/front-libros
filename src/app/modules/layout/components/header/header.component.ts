import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Telco Books</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/books" routerLinkActive="active">Books</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/authors" routerLinkActive="active">Authors</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent { }
