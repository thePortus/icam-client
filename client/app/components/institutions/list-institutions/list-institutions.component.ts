import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-institutions',
  templateUrl: './list-institutions.component.html',
  styleUrls: ['./list-institutions.component.scss']
})
export class ListInstitutionsComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByTitle: any;
  filterByLocation: any;
  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = true;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
    this.currentPage = 1;
  }

  navigate(path: string) {
    this._router.navigate(['/institutions/' + path]);
  }

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'institutions/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByTitle) {
      requestString += '&title=' + this.filterByTitle;
    }
    if (this.filterByLocation) {
      requestString += '&location=' + this.filterByLocation;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.protectedData = res.rows;
      this.totalItems = res.count;
      this.loading = false;
    });
  }

}
