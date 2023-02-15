import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-panels',
  templateUrl: './list-panels.component.html',
  styleUrls: ['./list-panels.component.scss']
})
export class ListPanelsComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByTitle: any;
  filterByType: any;
  filterByConference: any;
  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = false;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
    this.currentPage = 1;
  }

  navigate(path: string) {
    this._router.navigate(['/panels/' + path]);
  }

  // calculates total presenters for an individual panel across presentations
  totalPresenters(panelData: any) {
    let tally = 0;
    for (const presentation of panelData.presentations) {
      tally += presentation.presenters.length;
    }
    return tally;
  }

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

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
    });
  }

}
