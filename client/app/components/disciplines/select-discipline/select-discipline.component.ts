import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Discipline } from './../../../interfaces/discipline.interface';

@Component({
  selector: 'app-select-discipline',
  templateUrl: './select-discipline.component.html',
  styleUrls: ['./select-discipline.component.scss']
})
export class SelectDisciplineComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedDiscipline: any;
  acceptableDisciplines: Discipline[] = [];
  displayAddDiscipline: boolean = false;
  filterByTitle: string = '';
  
  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

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

  onSubmit() {
    let disciplineToAdd: any;
    for (let discipline of this.acceptableDisciplines) {
      if (discipline.id == this.selectedDiscipline) {
        disciplineToAdd = discipline;
      }
    }
    this.successfullyAdded.emit(disciplineToAdd);
  }

  toggleDisplayAddDiscipline() {
    this.displayAddDiscipline = !this.displayAddDiscipline;
  }

  disciplineAdded(discipline: any) {
    this.refreshData();
    this.selectedDiscipline = discipline.id;
    this.displayAddDiscipline = false;
    this.successfullyAdded.emit(discipline);
  }

}
