import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Location } from './../../../interfaces/location.interface';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedLocation: any;
  acceptableLocations: Location[] = [];
  displayAddLocation: boolean = false;
  filterByTitle: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

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

  onSubmit() {
    let locationToAdd: any;
    for (let location of this.acceptableLocations) {
      if (location.id == this.selectedLocation) {
        locationToAdd = location;
      }
    }
    this.successfullyAdded.emit(locationToAdd);
  }

  toggleDisplayAddLocation() {
    this.displayAddLocation = !this.displayAddLocation;
  }

  locationAdded(location: any) {
    this.refreshData();
    this.selectedLocation = location.id;
    this.displayAddLocation = false;
    this.successfullyAdded.emit(location);
  }

}
