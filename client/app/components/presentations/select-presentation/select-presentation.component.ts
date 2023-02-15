import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Presentation } from './../../../interfaces/presentation.interface';


@Component({
  selector: 'app-select-presentation',
  templateUrl: './select-presentation.component.html',
  styleUrls: ['./select-presentation.component.scss']
})
export class SelectPresentationComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];
  // for linking people
  @Input() includeName: boolean = false;

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedPresentation: any;
  acceptablePresentations: any[] = [];
  displayAddPresentation: boolean = false;
  filterByTitle: string = '';
  filterByConferenceTitle: string = '';
  filterByPanelTitle: string = '';
  filterByPresenterName: string = '';
  personName: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'presentations/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    if (this.filterByPanelTitle) {
      if (this.filterByTitle) {
        requestString += '&';
      }
      requestString += 'panel=' + this.filterByPanelTitle;
    }
    if (this.filterByConferenceTitle) {
      if (this.filterByTitle || this.filterByPanelTitle) {
        requestString += '&';
      }
      requestString += 'conference=' + this.filterByConferenceTitle;
    }
    if (this.filterByPresenterName) {
      if (this.filterByTitle || this.filterByPanelTitle || this.filterByConferenceTitle) {
        requestString += '&';
      }
      requestString += 'presenter=' + this.filterByPresenterName;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptablePresentations = res.sort(function(a:any, b:any) {
        // sort list of panels alphabetically by title
        let textA = a.title;
        let textB = b.title;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.loading = false;
    });
  }

  onSubmit() {
    let presentationToAdd: any;
    for (let presentation of this.acceptablePresentations) {
      if (presentation.id == this.selectedPresentation) {
        presentationToAdd = presentation;
        if (this.includeName) {
          presentationToAdd.personName = this.personName;
        }
      }
    }
    this.successfullyAdded.emit(presentationToAdd);
  }

  toggleDisplayAddPresentation() {
    this.displayAddPresentation = !this.displayAddPresentation;
  }

  presentationAdded(presentation: any) {
    this.refreshData();
    this.selectedPresentation = presentation.id;
    this.displayAddPresentation = false;
    this.successfullyAdded.emit(presentation);
  }

}
