import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Person } from './../../../interfaces/person.interface';

@Component({
  selector: 'app-select-person',
  templateUrl: './select-person.component.html',
  styleUrls: ['./select-person.component.scss']
})
export class SelectPersonComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];
  @Input() includeTitle: boolean = false;
  @Input() includeName: boolean = false;
  @Input() includeRole: boolean = false;

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedPerson: any;
  acceptablePeople: Person[] = [];
  displayAddPerson: boolean = false;
  personTitle: string = '';
  personName: string = '';
  filterByName: string = '';
  filterByPanelTitle: string = '';
  filterByPresentationTitle: string = '';
  newPersonWasAdded: boolean = false;
  role: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

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

  toggleDisplayAddPerson() {
    this.displayAddPerson = !this.displayAddPerson;
  }

  personAdded(person: any) {
    this.refreshData();
    this.newPersonWasAdded = true;
    this.selectedPerson = person.id;
    this.displayAddPerson = false;
    if (!this.includeName && !this.includeTitle && !this.includeRole) {
      this.successfullyAdded.emit(person);
    }
  }

}
