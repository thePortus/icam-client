import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Location } from './../../../interfaces/location.interface';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selecte item
  selectedLocation: any;
  // all possible items
  acceptableLocations: Location[] = [];
  // add new item flag
  displayAddLocation: boolean = false;
  // filter
  filterByTitle: string = '';

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
    let requestString: string = 'locations/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptableLocations = res.sort(function(a:any, b:any) {
        // sort list of locations alphabetically by title
        let textA = a.title;
        let textB = b.title;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.loading = false;
    });
  }

  /**
   * On selection, emits the data of the selected item.
   */
  onSubmit() {
    let locationToAdd: any;
    for (let location of this.acceptableLocations) {
      if (location.id == this.selectedLocation) {
        locationToAdd = location;
      }
    }
    this.successfullyAdded.emit(locationToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddLocation() {
    this.displayAddLocation = !this.displayAddLocation;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param location - the data of the added item, emitted by a child widget
   */
  locationAdded(location: any) {
    this.refreshData();
    this.selectedLocation = location.id;
    this.displayAddLocation = false;
    // emit selection
    this.successfullyAdded.emit(location);
  }

}
