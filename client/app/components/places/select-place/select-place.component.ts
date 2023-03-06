import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Place } from './../../../interfaces/place.interface';

@Component({
  selector: 'app-select-place',
  templateUrl: './select-place.component.html',
  styleUrls: ['./select-place.component.scss']
})
export class SelectPlaceComponent implements OnInit {
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
  // selected item
  selectedPlace: any;
  acceptablePlaces: Place[] = [];
  // add new item flag
  displayAddPlace: boolean = false;
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
    let requestString: string = 'geographies/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptablePlaces = res.sort(function(a:any, b:any) {
        // sort list of places alphabetically by title
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
    let placeToAdd: any;
    for (let place of this.acceptablePlaces) {
      if (place.id == this.selectedPlace) {
        placeToAdd = place;
      }
    }
    this.successfullyAdded.emit(placeToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddPlace() {
    this.displayAddPlace = !this.displayAddPlace;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param place - the data of the added item, emitted by a child widget
   */
  placeAdded(place: any) {
    this.refreshData();
    this.selectedPlace = place.id;
    this.displayAddPlace = false;
    // emit selection
    this.successfullyAdded.emit(place);
  }

}
