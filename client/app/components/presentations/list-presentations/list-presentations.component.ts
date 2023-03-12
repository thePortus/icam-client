import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PageEvent} from '@angular/material/paginator';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-presentations',
  templateUrl: './list-presentations.component.html',
  styleUrls: ['./list-presentations.component.scss']
})
export class ListPresentationsComponent implements OnInit {
  // id of items from server to list
  protectedData: any[] = [];
  // total count of items
  totalItems: any;
  // strings to filter results by (server-side)
  filterByTitle: any;
  filterByPanelTitle: any;
  filterByConferenceTitle: any;
  filterByPresenterName: any;
  filterByTopicTitle: any;
  filterByPlaceTitle: any;
  // fields to send to the filter widget
  filterFields = [{
    keyword: 'title',
    label: 'Title'
  }, {
    keyword: 'panel',
    label: 'Panel'
  }, {
    keyword: 'conference',
    label: 'Conference'
  }, {
    keyword: 'presenter',
    label: 'Presenter'
  }, {
    keyword: 'topic',
    label: 'Topic'
  }, {
    keyword: 'place',
    label: 'Place'
  }];
  // pagination data
  currentPage = 1;
  itemsPerPage = 5;
  // loading & error messages
  loading: boolean = true;
  loadingError: boolean = false;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  /**
   * Initialize pagination data and refresh data from server.
   */
  ngOnInit(): void {
    this.refreshData();
    this.currentPage = 1;
  }

  /**
   * Navigates router to specific sub item via specified path
   * 
   * @param path - path to item
   */
  navigate(path: string) {
    this._router.navigate(['/presentations/' + path]);
  }

  /**
   * Executed upon event emission by child filter widget. Copies
   * data from emitted object to filter fields.
   * 
   * @param filterInfo - Object with fields corresponding to each filter
   */
  updateFilter(filterInfo: any) {
    this.filterByTitle = filterInfo.title;
    this.filterByPanelTitle = filterInfo.panel;
    this.filterByConferenceTitle = filterInfo.conference;
    this.filterByPresenterName = filterInfo.presenter;
    this.filterByTopicTitle = filterInfo.topic;
    this.filterByPlaceTitle = filterInfo.place;
    this.refreshData();
  }

  /**
   * Executed upon event emission from child pagination widget.
   * Gets PageEvent from child widget and applies it to
   * component, then refreshes data.
   * 
   * @param e - PageEvent containing new index and size
   */
  changePagination(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.itemsPerPage = e.pageSize;
    this.refreshData();
  }

  /**
   * Gets data from server (replacing any previously fetched data).
   * First builds the request string, which will include current pagination
   * information, as well as any specified filter strings for server-side
   * filtering. Then performs the request, stores the data, and sets .loading
   * to false.
   */
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
