import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PageEvent} from '@angular/material/paginator';

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
  // fields to send to the filter widget
  filterFields = [{
    keyword: 'title',
    label: 'Title'
  }, {
    keyword: 'institution',
    label: 'Institutions'
  }, {
    keyword: 'discipline',
    label: 'Disciplines'
  }, {
    keyword: 'location',
    label: 'Location'
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
   * Executed upon event emission by child filter widget. Copies
   * data from emitted object to filter fields.
   * 
   * @param filterInfo - Object with fields corresponding to each filter
   */
  updateFilter(filterInfo: any) {
    this.filterByTitle = filterInfo.title;
    this.filterByInstitution = filterInfo.institution;
    this.filterByDiscipline = filterInfo.discipline;
    this.filterByLocation = filterInfo.location;
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
