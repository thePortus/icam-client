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
  name: string;
  confirm: boolean;
}

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit {
  // id of item to view
  @Input() personId = '';

  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  // storage for current item data from server
  protectedData: any;
  // toggle flags for displaying ui for linking items
  toggleDisplay = {
    'panels': false,
    'presentations': false,
    'institutions': false
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
   * Fetch item data from server, and set .loading flag to false.
   */
  update() {
    this._api.getTypeRequest('people/' + this.personId).subscribe((res: any) => {
      this.protectedData = res;
      this.protectedData.institutions = this.getInstitutionsAndDepartments();
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
    const dialogRef = this.dialog.open(ConfirmDeletePersonDialog, {
      width: '250px',
      data: {id: this.personId, title: this.protectedData.name},
    });
    // alter user role after closed, if confirmed
    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        this._api.deleteTypeRequest('people/' + this.personId).subscribe((res:any) => {
          if (typeof res.messages !== 'undefined') {
            this._snackBar.open('Item successfully deleted!', '', { duration: 3000 });
          }
          else {
            this._snackBar.open('Problem deleting item!', '', { duration: 5000 });
          }
          this._router.navigate(['/people']);
        });
      }
    });
    return true;
  }

  /**
   * Helper function called by parts of the HTML template. Returns an array objects,
   * with institution id as keys, at each value is a
   * { institution: {}, departments: [] } object.
   * 
   * @returns Array of objects with institution and department data
   */
  getInstitutionsAndDepartments() {
    // object to store institution info by institution id as key... will be converted into an array for return
    let institutionsAndDepartments: any = {};
    // return array, to contain convered object from above
    let returnArray: Array<any> = [];
    for (let chairInstitution of this.protectedData.affiliationsAsChair) {
      // if institution has been encountered before
      if (chairInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(chairInstitution.chairAffiliationLink.department in institutionsAndDepartments[chairInstitution.id].departments)) {
          institutionsAndDepartments[chairInstitution.id].departments.push(chairInstitution.chairAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (chairInstitution.chairAffiliationLink.department != '') {
        institutionsAndDepartments[chairInstitution.id] = {
          institution: chairInstitution,
          departments: [chairInstitution.chairAffiliationLink.department]
        };
      }
    }
    for (let presenterInstitution of this.protectedData.affiliationsAsPresenter) {
      // if institution has been encountered before
      if (presenterInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(presenterInstitution.presenterAffiliationLink.department in institutionsAndDepartments[presenterInstitution.id].departments)) {
          institutionsAndDepartments[presenterInstitution.id].departments.push(presenterInstitution.presenterAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (presenterInstitution.presenterAffiliationLink.department != '') {
        institutionsAndDepartments[presenterInstitution.id] = {
          institution: presenterInstitution,
          departments: [presenterInstitution.presenterAffiliationLink.department]
        };
      }
    }
    for (let participantInstitution of this.protectedData.affiliationsAsParticipant) {
      // if institution has been encountered before
      if (participantInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(participantInstitution.participantAffiliationLink.department in institutionsAndDepartments[participantInstitution.id].departments)) {
          institutionsAndDepartments[participantInstitution.id].departments.push(participantInstitution.participantAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (participantInstitution.participantAffiliationLink.department != '') {
        institutionsAndDepartments[participantInstitution.id] = {
          institution: participantInstitution,
          departments: [participantInstitution.participantAffiliationLink.department]
        };
      }
    }
    // now convert each spot in object to an item in the array
    for (let institution in institutionsAndDepartments) {
      returnArray.push(institutionsAndDepartments[institution]);
    }
    return returnArray;
  }

}

@Component({
  selector: 'confirm-delete-person-dialog',
  templateUrl: 'confirm-delete-person.dialogue.html',
})
export class ConfirmDeletePersonDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletePersonDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData
  ) {}
}