import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() page: number;
  @Input() size: number;
  @Input() totalItems: number;

  @Output() paginationSet = new EventEmitter<any>();

  totalPages: number = 0;
  loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalPages = Math.ceil(this.totalItems / this.size);
    this.loading = false;
  }

  emitChanges() {
    this.paginationSet.emit({
      page: this.page,
      size: this.size
    });
  }

  incrementPage() {
    if (this.page + 1 <= this.totalPages) {
      this.page += 1;
    }
    this.emitChanges();
  }

  decrementPage() {
    if (this.page -1 >= 1) {
      this.page -= 1;
    }
    this.emitChanges();
  }

  setPageToFirst() {
    this.page = 1;
    this.emitChanges();
  }

  setPageToLast() {
    this.page = this.totalPages;
    this.emitChanges();
  }

  setSize() {
    if (this.size <= 0) {
      this.size = 1;
    }
    this.totalPages = Math.ceil(this.totalItems / this.size);
    this.page = 1;
    this.emitChanges();
  }

}
