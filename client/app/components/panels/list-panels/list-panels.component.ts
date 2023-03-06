import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
   * Gets paginationData from child widget and applies it to
   * component, then refreshes data.
   * 
   * @param paginationData 
   */
  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
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
