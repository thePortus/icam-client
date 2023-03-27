import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Conference } from './../../../interfaces/conference.interface';

@Component({
  selector: 'app-select-conference',
  templateUrl: './select-conference.component.html',
  styleUrls: ['./select-conference.component.scss']
})
export class SelectConferenceComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];
  // toggle to display/hide role info
  @Input() includeRole: boolean = false;

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedConference: any;
  // all possible items
  acceptableConferences: Conference[] = [];
  // add new item flag
  displayAddConference: boolean = false;
  // filter
  filterByTitle: string = '';
  // role
  role: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  /**
   * Refreshes data from server and stores in acceptable items. Uses
   * pagination and filter information to only retrieve pertinent items.
   * Also calculates total number of items and sets loading to false.
   */
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

  /**
   * On selection, emits the data of the selected item.
   */
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

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddConference() {
    this.displayAddConference = !this.displayAddConference;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent (but only
   * if the includeRole inputs is false).
   * 
   * @param conference - the data of the added item, emitted by a child widget
   */
  conferenceAdded(conference: any) {
    this.refreshData();
    this.selectedConference = conference.id;
    this.displayAddConference = false;
    if (this.includeRole) {
      conference.role = this.role;
    }
    // emit selection if includeRole input is false
    else {
      this.successfullyAdded.emit(conference);
    }
  }

}
