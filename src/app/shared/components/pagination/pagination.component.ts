import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];
  visiblePages: number[] = [];

  ngOnChanges() {
    this.calculateVisiblePages();
  }

  calculateVisiblePages() {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(this.currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisiblePages - 1, this.totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    this.visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }

  changePage(page: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  showLeftEllipsis(): boolean {
    return this.visiblePages[0] > 1;
  }

  showRightEllipsis(): boolean {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages;
  }
}
