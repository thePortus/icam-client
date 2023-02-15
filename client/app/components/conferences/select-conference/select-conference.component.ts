import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Conference } from './../../../interfaces/conference.interface';

@Component({
  selector: 'app-select-conference',
  templateUrl: './select-conference.component.html',
  styleUrls: ['./select-conference.component.scss']
})
export class SelectConferenceComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];
  @Input() includeRole: boolean = false;

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedConference: any;
  acceptableConferences: Conference[] = [];
  displayAddConference: boolean = false;
  filterByTitle: string = '';
  role: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'conferences/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptableConferences = res.sort(function(a:any, b:any) {
        // sort list of conferences by year
        let yearA = a.year;
        let yearB = b.year;
        return (yearA < yearB) ? -1 : (yearA > yearB) ? 1 : 0;
      });
      this.loading = false;
    });
  }

  onSubmit() {
    let conferenceToAdd: any;
    for (let conference of this.acceptableConferences) {
      if (conference.id == this.selectedConference) {
        conferenceToAdd = conference;
      }
    }
    if (this.includeRole) {
      conferenceToAdd.role = this.role;
    }
    this.successfullyAdded.emit(conferenceToAdd);
  }

  toggleDisplayAddConference() {
    this.displayAddConference = !this.displayAddConference;
  }

  conferenceAdded(conference: any) {
    this.refreshData();
    this.selectedConference = conference.id;
    this.displayAddConference = false;
    if (this.includeRole) {
      conference.role = this.role;
    }
    else {
      this.successfullyAdded.emit(conference);
    }
  }

}
