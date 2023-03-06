import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Discipline } from './../../../interfaces/discipline.interface';

@Component({
  selector: 'app-select-discipline',
  templateUrl: './select-discipline.component.html',
  styleUrls: ['./select-discipline.component.scss']
})
export class SelectDisciplineComponent implements OnInit {
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
  selectedDiscipline: any;
  // all possible items
  acceptableDisciplines: Discipline[] = [];
  // add new item flag
  displayAddDiscipline: boolean = false;
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
    let requestString: string = 'disciplines/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptableDisciplines = res.sort(function(a:any, b:any) {
        // sort list of disciplines alphabetically by title
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
    let disciplineToAdd: any;
    for (let discipline of this.acceptableDisciplines) {
      if (discipline.id == this.selectedDiscipline) {
        disciplineToAdd = discipline;
      }
    }
    this.successfullyAdded.emit(disciplineToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddDiscipline() {
    this.displayAddDiscipline = !this.displayAddDiscipline;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param discipline - the data of the added item, emitted by a child widget
   */
  disciplineAdded(discipline: any) {
    this.refreshData();
    this.selectedDiscipline = discipline.id;
    this.displayAddDiscipline = false;
    // emit selection
    this.successfullyAdded.emit(discipline);
  }

}
