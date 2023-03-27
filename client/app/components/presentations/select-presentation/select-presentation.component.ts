import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Presentation } from './../../../interfaces/presentation.interface';


@Component({
  selector: 'app-select-presentation',
  templateUrl: './select-presentation.component.html',
  styleUrls: ['./select-presentation.component.scss']
})
export class SelectPresentationComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];
  // toggle to display/hide name data
  @Input() includeName: boolean = false;
  // toggle to include an isRespondant field when linking people
  @Input() includeRespondent: boolean = false;

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedPresentation: any;
  // acceptable items
  acceptablePresentations: any[] = [];
  // add new item flag
  displayAddPresentation: boolean = false;
  // filters
  filterByTitle: string = '';
  filterByConferenceTitle: string = '';
  filterByPanelTitle: string = '';
  filterByPresenterName: string = '';
  // optional person name info
  personName: string = '';
  // whether person is respondent
  isRespondent: boolean = false;

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

  /**
   * On selection, emits the data of the selected item.
   */
  onSubmit() {
    let presentationToAdd: any;
    for (let presentation of this.acceptablePresentations) {
      if (presentation.id == this.selectedPresentation) {
        presentationToAdd = presentation;
        if (this.includeName) {
          presentationToAdd.personName = this.personName;
        }
        if (this.includeRespondent) {
          presentationToAdd.isRespondant = this.isRespondent;
        }
      }
    }
    this.successfullyAdded.emit(presentationToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddPresentation() {
    this.displayAddPresentation = !this.displayAddPresentation;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param presentation - the data of the added item, emitted by a child widget
   */
  presentationAdded(presentation: any) {
    this.refreshData();
    this.selectedPresentation = presentation.id;
    this.displayAddPresentation = false;
    // emit selection
    this.successfullyAdded.emit(presentation);
  }

}
