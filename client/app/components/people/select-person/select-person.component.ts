import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Person } from './../../../interfaces/person.interface';

@Component({
  selector: 'app-select-person',
  templateUrl: './select-person.component.html',
  styleUrls: ['./select-person.component.scss']
})
export class SelectPersonComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];
  // toggle to show/hide title, name, and role data
  @Input() includeTitle: boolean = false;
  @Input() includeName: boolean = false;
  @Input() includeRole: boolean = false;

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedPerson: any;
  // all possible items
  acceptablePeople: Person[] = [];
  // add new item flag
  displayAddPerson: boolean = false;
  // optional person title/name info
  personTitle: string = '';
  personName: string = '';
  // filters
  filterByName: string = '';
  filterByPanelTitle: string = '';
  filterByPresentationTitle: string = '';
  // flag if person was added (to force refresh to people data)
  newPersonWasAdded: boolean = false;
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
    let requestString: string = 'people/?';
    if (this.filterByName) {
      requestString += 'name=' + this.filterByName;
    }
    if (this.filterByPanelTitle) {
      if (this.filterByName) {
        requestString += '&';
      }
      requestString += 'panel=' + this.filterByPanelTitle;
    }
    if (this.filterByPresentationTitle) {
      if (this.filterByName || this.filterByPanelTitle) {
        requestString += '&';
      }
      requestString += 'presentation=' + this.filterByPresentationTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptablePeople = res.sort(function(a:any, b:any) {
        // sort list of people alphabetically by title
        let textA = a.name;
        let textB = b.name;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.loading = false;
    });
  }

  /**
   * On selection, emits the data of the selected item.
   */
  onSubmit() {
    let personToAdd: any;
    for (let person of this.acceptablePeople) {
      if (person.id == this.selectedPerson) {
        personToAdd = person;
        if (this.includeTitle) {
          personToAdd.title = this.personTitle;
        }
        if (this.includeName) {
          personToAdd.name = this.personName;
        }
        if (this.includeRole) {
          personToAdd.role = this.role;
        }
        break;
      }
    }
    // add flag indicated whether new person was added during selection
    personToAdd.newPersonWasAdded = this.newPersonWasAdded;
    this.successfullyAdded.emit(personToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddPerson() {
    this.displayAddPerson = !this.displayAddPerson;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent (but only
   * if the includeTitle & includeRole inputs are false).
   * 
   * @param person - the data of the added item, emitted by a child widget
   */
  personAdded(person: any) {
    this.refreshData();
    this.newPersonWasAdded = true;
    this.selectedPerson = person.id;
    this.displayAddPerson = false;
    // emit selection, but only if includeTitle and includeRoles inputs are false
    if (!this.includeName && !this.includeTitle && !this.includeRole) {
      this.successfullyAdded.emit(person);
    }
  }

}
