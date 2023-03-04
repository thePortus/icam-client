import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.component.html',
  styleUrls: ['./list-places.component.scss']
})
export class ListPlacesComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByTitle: any;
  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = true;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  navigate(path: string) {
    this._router.navigate(['/places/' + path]);
  }

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'geographies/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByTitle) {
      requestString += '&title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.protectedData = res.rows;
      this.totalItems = res.count;
      this.loading = false;
    });
  }

}
