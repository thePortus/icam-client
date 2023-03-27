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
  selector: 'app-discipline-detail',
  templateUrl: './discipline-detail.component.html',
  styleUrls: ['./discipline-detail.component.scss']
})
export class DisciplineDetailComponent implements OnInit {
  // id of item to view
  @Input() disciplineId = '';

  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  // storage for current item data from server
  protectedData: any;

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
   * Fetch item data from server and set .loading flag to false.
   */
  update() {
    this._api.getTypeRequest('disciplines/' + this.disciplineId).subscribe((res: any) => {
      this.protectedData = res;
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
    const dialogRef = this.dialog.open(ConfirmDeleteDisciplineDialog, {
      width: '250px',
      data: {id: this.disciplineId, title: this.protectedData.title},
    });
    // alter user role after closed, if confirmed
    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        for (let conference of this.protectedData.conferences) {
          this._api.deleteTypeRequest('conference-disciplines/' + conference.id + '/' + this.disciplineId).subscribe();
        }
        this._api.deleteTypeRequest('disciplines/' + this.disciplineId).subscribe((res:any) => {
          if (typeof res.messages !== 'undefined') {
            this._snackBar.open('Item successfully deleted!', '', { duration: 3000 });
          }
          else {
            this._snackBar.open('Problem deleting item!', '', { duration: 5000 });
          }
          this._router.navigate(['/disciplines']);
        });
      }
    });
    return true;
  }

}

@Component({
  selector: 'confirm-delete-discipline-dialog',
  templateUrl: 'confirm-delete-discipline.dialogue.html',
})
export class ConfirmDeleteDisciplineDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDisciplineDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData
  ) {}
}