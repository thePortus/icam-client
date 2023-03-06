import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-conferences',
  templateUrl: './list-conferences.component.html',
  styleUrls: ['./list-conferences.component.scss']
})
export class ListConferencesComponent implements OnInit {
  // id of items from server to list
  protectedData: any[] = [];
  // total count of items
  totalItems: any;
  // strings to filter results by (server-side)
  filterByTitle: any;
  filterByInstitution: any;
  filterByDiscipline: any;
  filterByLocation: any;
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
    this.currentPage = 1;
    this.refreshData();
  }

  /**
   * Navigates router to specific sub item via specified path
   * 
   * @param path - path to item
   */
  navigate(path: string) {
    this._router.navigate(['/conferences/' + path]);
  }

  /**
   * Tallies total number of chairs for a given conference
   * 
   * @param conferenceData - Object with item data to tally
   * @returns Total number of items
   */
  totalChairs(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      tally += panel.chairs.length;
    }
    return tally;
  }

  /**
   * Tallies total number of presentations for a given conferences
   * 
   * @param conferenceData - Object with item data to tally
   * @returns Total number of items
   */
  totalPresentations(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      tally += panel.presentations.length;
    }
    return tally;
  }

  /**
   * Tallies total number of presenters for a given conferences
   * 
   * @param conferenceData - Object with item data to tally
   * @returns Total number of items
   */
  totalPresenters(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      for (const presentation of panel.presentations) {
        tally += presentation.presenters.length;
      }
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
    let requestString: string = 'conferences/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByTitle) {
      requestString += '&title=' + this.filterByTitle;
    }
    if (this.filterByInstitution) {
      requestString += '&institution=' + this.filterByInstitution;
    }
    if (this.filterByDiscipline) {
      requestString += '&discipline=' + this.filterByDiscipline;
    }
    if (this.filterByLocation) {
      requestString += '&location=' + this.filterByLocation;
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
