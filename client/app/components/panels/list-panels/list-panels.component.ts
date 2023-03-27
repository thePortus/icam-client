import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PageEvent} from '@angular/material/paginator';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-panels',
  templateUrl: './list-panels.component.html',
  styleUrls: ['./list-panels.component.scss']
})
export class ListPanelsComponent implements OnInit {
  // id of items from server to list
  protectedData: any[] = [];
  // total count of items
  totalItems: any;
  // strings to filter results by (server-side)
  filterByTitle: any;
  filterByType: any;
  filterByConference: any;
  // fields to send to the filter widget
  filterFields = [{
    keyword: 'title',
    label: 'Title'
  }, {
    keyword: 'type',
    label: 'Type'
  }, {
    keyword: 'conference',
    label: 'Conference'
  }];
  filterHidden: boolean = true;
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
    this._router.navigate(['/panels/' + path]);
  }

  /**
   * Executed upon event emission by child filter widget. Copies
   * data from emitted object to filter fields.
   * 
   * @param filterInfo - Object with fields corresponding to each filter
   */
  updateFilter(filterInfo: any) {
    this.filterByTitle = filterInfo.title;
    this.filterByType = filterInfo.type;
    this.filterByConference = filterInfo.conference;
    this.refreshData();
  }

  /** 
   * Executed upon event emission by child filter widget. Toggles
   * the display status of filter to update CSS classes for 
   * padding.
   * 
   * @param displayStatus - Boolean of new filter display status
   */
  toggleFilter(displayStatus: boolean) {
    this.filterHidden = displayStatus;
  }

  /**
   * Tallies total number of presenter for a given panel
   * 
   * @param panelData - Object with item data to tally
   * @returns Total number of items
   */
  totalPresenters(panelData: any) {
    let tally = 0;
    for (const presentation of panelData.presentations) {
      tally += presentation.presenters.length;
    }
    return tally;
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
    let requestString: string = 'panels/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByTitle) {
      requestString += '&title=' + this.filterByTitle;
    }
    if (this.filterByType) {
      requestString += '&type=' + this.filterByType;
    }
    if (this.filterByConference) {
      requestString += '&conference=' + this.filterByConference;
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
