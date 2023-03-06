import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  // current page number, current items per page, and total items
  @Input() page: number;
  @Input() size: number;
  @Input() totalItems: number;
  // signals to parent that page has changed
  @Output() paginationSet = new EventEmitter<any>();

  // total number page pages, based on size and totalItems inputs (calculated in .ngOnChanges())
  totalPages: number = 0;
  loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Recalculates the total number of pages based on size and totalItems,
   * and sets .loading to false.
   * 
   * @param changes - Contains changes to any inputs, not actually needed by the method
   */
  ngOnChanges(changes: SimpleChanges) {
    this.totalPages = Math.ceil(this.totalItems / this.size);
    this.loading = false;
  }

  /**
   * Emits the page and size to any parent by paginationSet.
   */
  emitChanges() {
    this.paginationSet.emit({
      page: this.page,
      size: this.size
    });
  }

  /**
   * Increments the current page by one, unless already at maximum.
   */
  incrementPage() {
    if (this.page + 1 <= this.totalPages) {
      this.page += 1;
    }
    this.emitChanges();
  }

  /**
   * Decrements the current page by one, unless already at minimum.
   */
  decrementPage() {
    if (this.page -1 >= 1) {
      this.page -= 1;
    }
    this.emitChanges();
  }

  /**
   * Sets page to the first.
   */
  setPageToFirst() {
    this.page = 1;
    this.emitChanges();
  }

  /**
   * Sets page to the maximum.
   */
  setPageToLast() {
    this.page = this.totalPages;
    this.emitChanges();
  }

  /**
   * Sets the current number of items per page.
   */
  setSize() {
    if (this.size <= 0) {
      this.size = 1;
    }
    this.totalPages = Math.ceil(this.totalItems / this.size);
    this.page = 1;
    this.emitChanges();
  }

}
