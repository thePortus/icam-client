import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';


// the object to be passed/received by the confirmation dialogue
export interface ConfirmDeleteDialogData {
  id: number;
  title: string;
  confirm: boolean;
}

@Component({
  selector: 'app-conference-detail',
  templateUrl: './conference-detail.component.html',
  styleUrls: ['./conference-detail.component.scss']
})
export class ConferenceDetailComponent implements OnInit {
  // id of item to view
  @Input() conferenceId = '';

  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  // storage for current item data from server
  protectedData: any;
  // for storing flattened form on related item info in this.protectedData on presentations, chairs, and presenters
  flattenedData: any;
  // for storing item counts
  totals = {
    'panels': 0,
    'presentations': 0,
    'chairs': 0,
    'presenters': 0
  };
  // toggle flags for displaying ui for linking items
  toggleDisplay = {
    'panels': false,
    'presentations': false,
    'chairs': false,
    'presenters': false,
    'institutions': false,
    'participants': false
  };

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _router: Router,
    public dialog: MatDialog
  ) { }

  /**
   * Gets user details, fetches data from server.
   */
  ngOnInit(): void {
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.update();
  }

  /**
   * On component changes, re-fetch data from server.
   * 
   * @param changes - Data on nature of component changes (unnecessary)
   */
  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  /**
   * Fetch item data from server, perform calculation of item totals, flattening of data,
   * and set .loading flag to false.
   */
  update() {
    this._api.getTypeRequest('conferences/' + this.conferenceId).subscribe((res: any) => {
      this.protectedData = res;
      this.getTotals();
      this.flattenData();
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  /**
   * iterates over related items (panels, presentations, presenters, chairs),
   * tallies them, and stores them in this.totals.
   */
  getTotals() {
    this.totals = {
      'panels': 0,
      'presentations': 0,
      'chairs': 0,
      'presenters': 0,
    };
    for(let panel of this.protectedData.panels) {
      this.totals.panels += 1;
      for (let chair of panel.chairs) {
        this.totals.chairs +=1 ;
      }
      for (let presentation of panel.presentations) {
        this.totals.presentations += 1;
        for (let presenter of presentation.presenters) {
          this.totals.presenters += 1;
        }
      }
    }
  }

  /**
   * Asks to confirm via alert. Then unlinks all linked items and finally
   * deletes the item itself. Navigates back to list of items.
   * 
   * @returns true
   */
  deleteItem() {
    // set size and data of dialogue box
    const dialogRef = this.dialog.open(ConfirmDeleteConferenceDialog, {
      width: '250px',
      data: {id: this.conferenceId, title: this.protectedData.title},
    });
    // alter user role after closed, if confirmed
    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        for (let discipline of this.protectedData.disciplines) {
          this._api.deleteTypeRequest('conference-disciplines/' + this.conferenceId + '/' + discipline.id).subscribe();
        }
        for (let institution of this.protectedData.institutions) {
          this._api.deleteTypeRequest('conference-institutions/' + this.conferenceId + '/' + institution.id).subscribe();
        }
        this._api.deleteTypeRequest('conferences/' + this.conferenceId).subscribe((res:any) => {
          alert('Item successfully deleted!');
          this._router.navigate(['/conferences']);
        });
      }
    });
    return true;
  }

  /**
   * Cyles through protectedData nested data and gets info on presentations,
   * chairs, and presenters in flattened form. Stores in this.flattenedData.
   * 
   * @returns true
   */
  flattenData() {
    this.flattenedData = {
      presentations: [],
      chairs: [],
      presenters: []
    };
    for (let panel of this.protectedData.panels) {
      // copy chairs, avoiding duplicates
      for (let chair of panel.chairs) {
        let chairFound = false;
        for (let previousChair of this.flattenedData.chairs) {
          if (chair.id === previousChair.id) {
            chairFound = true;
          }
        }
        if (!chairFound) {
          this.flattenedData.chairs.push(chair);
        }
      }
      // copy presentations
      for (let presentation of panel.presentations) {
        this.flattenedData.presentations.push(presentation);
        // copy presenters, avoiding duplicates
        for (let presenter of presentation.presenters) {
          let presenterFound = false;
          for (let previousPresenter of this.flattenedData.presenters) {
            if (presenter.id === previousPresenter.id) {
              presenterFound = true;
            }
          }
          if (!presenterFound) {
            this.flattenedData.presenters.push(presenter);
          }
        }
      }
    }
    return true;
  }

}

@Component({
  selector: 'confirm-delete-conference-dialog',
  templateUrl: 'confirm-delete-conference.dialogue.html',
})
export class ConfirmDeleteConferenceDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteConferenceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData
  ) {}
}