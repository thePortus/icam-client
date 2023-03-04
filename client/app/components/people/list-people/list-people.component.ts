import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.scss']
})
export class ListPeopleComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByName: any;
  filterByPanelTitle: any;
  filterByPresentationTitle: any;
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
    this._router.navigate(['/people/' + path]);
  }

  // tallys total institutional affiliations, avoiding duplicates
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

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

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
