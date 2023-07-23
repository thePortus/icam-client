import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

// the object to be passed/received by the confirmation dialogue
export interface ConfirmDeleteDialogData {
  id: number;
  title: string;
  confirm: boolean;
}

@Component({
  selector: 'app-panel-detail',
  templateUrl: './panel-detail.component.html',
  styleUrls: ['./panel-detail.component.scss']
})
export class PanelDetailComponent implements OnInit {
  // id of item to view
  @Input() panelId = '';

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
    'presentations': 0,
    'chairs': 0,
    'presenters': 0,
    'respondents': 0
  };
  // toggle flags for displaying ui for linking items
  toggleDisplay = {
    'presentations': false,
    'chairs': false,
    'presenters': false,
    'respondents': false
  };

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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
    this._api.getTypeRequest('panels/' + this.panelId).subscribe((res: any) => {
      this.protectedData = res;
      this.getTotals();
      this.flattenData();
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  /**
   * Asks to confirm via dialog. Then unlinks all linked items and finally
   * deletes the item itself. Navigates back to list of items.
   * 
   * @returns true
   */
  deleteItem() {
    // set size and data of dialogue box
    const dialogRef = this.dialog.open(ConfirmDeletePanelDialog, {
      width: '250px',
      data: {id: this.panelId, title: this.protectedData.title},
    });
    // alter user role after closed, if confirmed
    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        this._api.deleteTypeRequest('panels/' + this.panelId).subscribe((res:any) => {
          if (res.message == 'Panel was deleted successfully!') {
            this._snackBar.open('Item successfully deleted!', '', { duration: 3000 });
          }
          else {
            this._snackBar.open('Problem deleting item!', '', { duration: 5000 });
          }
          this._router.navigate(['/panels']);
        });
      }
    });
  }

  /**
   * iterates over related items (presentations, presenters, chairs),
   * tallies them, and stores them in this.totals.
   */
  getTotals() {
    this.totals = {
      'presentations': 0,
      'chairs': 0,
      'presenters': 0,
      'respondents': 0
    };
    for (let chair of this.protectedData.chairs) {
      this.totals.chairs +=1 ;
    }
    for (let respondent of this.protectedData.respondents) {
      this.totals.respondents += 1;
    }
    for (let presentation of this.protectedData.presentations) {
      this.totals.presentations += 1;
      for (let presenter of presentation.presenters) {
        this.totals.presenters += 1;
      }
    }
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
      presenters: [],
      respondents: []
    };
    // copy chairs, avoiding duplicates
    for (let chair of this.protectedData.chairs) {
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
    // copy respondents
    for (let respondent of this.protectedData.respondents) {
      let respondentFound = false;
      for (let previousRespondent of this.flattenedData.respondents) {
        if (respondent.id === previousRespondent.id) {
          respondentFound = true;
        }
      }
      if (!respondentFound) {
        this.flattenedData.respondents.push(respondent);
      }
    }
    // copy presentations
    for (let presentation of this.protectedData.presentations) {
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
    return true;
  }

}

@Component({
  selector: 'confirm-delete-panel-dialog',
  templateUrl: 'confirm-delete-panel.dialogue.html',
})
export class ConfirmDeletePanelDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletePanelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData
  ) {}
}