import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.scss']
})
export class ListPeopleComponent implements OnInit {
  // id of items from server to list
  protectedData: any[] = [];
  // total count of items
  totalItems: any;
  // strings to filter results by (server-side)
  filterByName: any;
  filterByPanelTitle: any;
  filterByPresentationTitle: any;
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
    this._router.navigate(['/people/' + path]);
  }

  /**
   * Tallies total number of institutions for a given person
   * 
   * @param personData - Object with item data to tally
   * @returns Total number of items
   */
  totalInstitutions(personData:any) {
    let tally = 0;
    let foundIds: Array<number> = [];
    for (let affiliation of personData.affiliationsAsChair) {
      if (!foundIds.includes(affiliation.id)) {
        foundIds.push(affiliation.id);
        tally += 1;
      }
    }
    for (let affiliation of personData.affiliationsAsPresenter) {
      if (!foundIds.includes(affiliation.id)) {
        foundIds.push(affiliation.id);
        tally += 1;
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
    let requestString: string = 'people/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByName) {
      requestString += '&name=' + this.filterByName;
    }
    if (this.filterByPanelTitle) {
      requestString += '&panel=' + this.filterByPanelTitle;
    }
    if (this.filterByPresentationTitle) {
      requestString += '&presentation=' + this.filterByPresentationTitle;
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
