import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Institution } from './../../../interfaces/institution.interface';

@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.component.html',
  styleUrls: ['./select-institution.component.scss']
})
export class SelectInstitutionComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];
  @Input() includeRoles: boolean = false;

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedInstitution: any;
  acceptableInstitutions: Institution[] = [];
  displayAddInstitution: boolean = false;
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

  toggleDisplayAddInstitution() {
    this.displayAddInstitution = !this.displayAddInstitution;
  }

  institutionAdded(institution: any) {
    this.refreshData();
    this.displayAddInstitution = false;
    this.roles = {
      'sponsor': false,
      'host': false,
      'society': false
    };
    if (!this.includeRoles) {
      this.successfullyAdded.emit(institution);
    }
  }

}
