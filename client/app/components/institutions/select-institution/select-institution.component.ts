import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Institution } from './../../../interfaces/institution.interface';

@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.component.html',
  styleUrls: ['./select-institution.component.scss']
})
export class SelectInstitutionComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];
  // toggle to display/hide role info
  @Input() includeRoles: boolean = false;

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedInstitution: any;
  // all possible items
  acceptableInstitutions: Institution[] = [];
  // add new item flag
  displayAddInstitution: boolean = false;
  // filters
  filterByTitle: string = '';
  filterByLocation: string = '';
  // sponsor, host, and society flags, if roles are needed
  roles = {
    'host': false,
    'sponsor': false,
    'society': false
  };

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
    let requestString: string = 'institutions/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    if (this.filterByLocation) {
      if (this.filterByTitle) {
        requestString += '&';
      }
      requestString += 'location=' + this.filterByLocation;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptableInstitutions = res.sort(function(a:any, b:any) {
        // sort list of panels alphabetically by title
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
    let institutionToAdd: any;
    for (let institution of this.acceptableInstitutions) {
      if (institution.id == this.selectedInstitution) {
        institutionToAdd = institution;
      }
    }
    if (this.includeRoles) {
      institutionToAdd.roles = this.roles;
    }
    this.successfullyAdded.emit(institutionToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddInstitution() {
    this.displayAddInstitution = !this.displayAddInstitution;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent (but only
   * if the includeRole inputs is false).
   * 
   * @param institution - the data of the added item, emitted by a child widget
   */
  institutionAdded(institution: any) {
    this.refreshData();
    this.displayAddInstitution = false;
    this.roles = {
      'sponsor': false,
      'host': false,
      'society': false
    };
    // emit selection if includeRoles input is false
    if (!this.includeRoles) {
      this.successfullyAdded.emit(institution);
    }
  }

}
