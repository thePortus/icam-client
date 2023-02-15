import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-select-panel',
  templateUrl: './select-panel.component.html',
  styleUrls: ['./select-panel.component.scss']
})
export class SelectPanelComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];
  // for linking people
  @Input() includeTitle: boolean = false;
  @Input() includeName: boolean = false;

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedPanel: any;
  acceptablePanels: any[] = [];
  displayAddPanel: boolean = false;
  filterByTitle: string = '';
  filterByConferenceTitle: string = '';
  personTitle: string = '';
  personName: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

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

  toggleDisplayAddPanel() {
    this.displayAddPanel = !this.displayAddPanel;
  }

  panelAdded(panel: any) {
    this.refreshData();
    this.selectedPanel = panel.id;
    this.displayAddPanel = false;
    this.successfullyAdded.emit(panel);
  }

}
