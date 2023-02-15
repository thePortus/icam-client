import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Place } from './../../../interfaces/place.interface';

@Component({
  selector: 'app-select-place',
  templateUrl: './select-place.component.html',
  styleUrls: ['./select-place.component.scss']
})
export class SelectPlaceComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedPlace: any;
  acceptablePlaces: Place[] = [];
  displayAddPlace: boolean = false;
  filterByTitle: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

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

  onSubmit() {
    let placeToAdd: any;
    for (let place of this.acceptablePlaces) {
      if (place.id == this.selectedPlace) {
        placeToAdd = place;
      }
    }
    this.successfullyAdded.emit(placeToAdd);
  }

  toggleDisplayAddPlace() {
    this.displayAddPlace = !this.displayAddPlace;
  }

  placeAdded(place: any) {
    this.refreshData();
    this.selectedPlace = place.id;
    this.displayAddPlace = false;
    this.successfullyAdded.emit(place);
  }

}
