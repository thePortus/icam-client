import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-select-panel',
  templateUrl: './select-panel.component.html',
  styleUrls: ['./select-panel.component.scss']
})
export class SelectPanelComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];
  // toggle to display/hide title & name info
  @Input() includeTitle: boolean = false;
  @Input() includeName: boolean = false;

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedPanel: any;
  acceptablePanels: any[] = [];
  // add new item flag
  displayAddPanel: boolean = false;
  // filters
  filterByTitle: string = '';
  filterByConferenceTitle: string = '';
  // optional person title & name info
  personTitle: string = '';
  personName: string = '';

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
    let requestString: string = 'panels/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    if (this.filterByConferenceTitle) {
      if (this.filterByTitle) {
        requestString += '&';
      }
      requestString += 'conference=' + this.filterByConferenceTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptablePanels = res.sort(function(a:any, b:any) {
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
    let panelToAdd: any;
    for (let panel of this.acceptablePanels) {
      if (panel.id == this.selectedPanel) {
        panelToAdd = panel;
        if (this.includeTitle) {
          panelToAdd.personTitle = this.personTitle;
        }
        if (this.includeName) {
          panelToAdd.personName = this.personName;
        }
        break;
      }
    }
    this.successfullyAdded.emit(panelToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddPanel() {
    this.displayAddPanel = !this.displayAddPanel;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param panel - the data of the added item, emitted by a child widget
   */
  panelAdded(panel: any) {
    this.refreshData();
    this.selectedPanel = panel.id;
    this.displayAddPanel = false;
    // emit selection
    this.successfullyAdded.emit(panel);
  }

}
