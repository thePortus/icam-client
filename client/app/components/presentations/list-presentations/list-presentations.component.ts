import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-presentations',
  templateUrl: './list-presentations.component.html',
  styleUrls: ['./list-presentations.component.scss']
})
export class ListPresentationsComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByTitle: any;
  filterByPanelTitle: any;
  filterByConferenceTitle: any;
  filterByPresenterName: any;
  filterByTopicTitle: any;
  filterByPlaceTitle: any;
  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = true;
  loadingError: boolean = false;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
    this.currentPage = 1;
  }

  navigate(path: string) {
    this._router.navigate(['/presentations/' + path]);
  }

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'presentations/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByTitle) {
      requestString += '&title=' + this.filterByTitle;
    }
    if (this.filterByPanelTitle) {
      requestString += '&panel=' + this.filterByPanelTitle;
    }
    if (this.filterByConferenceTitle) {
      requestString += '&conference=' + this.filterByConferenceTitle;
    }
    if (this.filterByPresenterName) {
      requestString += '&presenter=' + this.filterByPresenterName;
    }
    if (this.filterByTopicTitle) {
      requestString += '&topic=' + this.filterByTopicTitle;
    }
    if (this.filterByPlaceTitle) {
      requestString += '&place=' + this.filterByPlaceTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.protectedData = res.rows;
      this.totalItems = res.count;
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

}
