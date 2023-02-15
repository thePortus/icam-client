import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-list-conferences',
  templateUrl: './list-conferences.component.html',
  styleUrls: ['./list-conferences.component.scss']
})
export class ListConferencesComponent implements OnInit {
  protectedData: any[] = [];
  totalItems: any;
  filterByTitle: any;
  filterByInstitution: any;
  filterByDiscipline: any;
  filterByLocation: any;
  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = false;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.refreshData();
  }

  navigate(path: string) {
    this._router.navigate(['/conferences/' + path]);
  }

  totalChairs(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      tally += panel.chairs.length;
    }
    return tally;
  }

  totalPresentations(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      tally += panel.presentations.length;
    }
    return tally;
  }

  totalPresenters(conferenceData:any) {
    let tally = 0;
    for (const panel of conferenceData.panels) {
      for (const presentation of panel.presentations) {
        tally += presentation.presenters.length;
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
    });
  }

}
