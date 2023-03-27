import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

// the object to be passed/received by the confirmation dialogue
export interface DialogData {
  username: string;
  role: string;
  confirm: boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // flags to store whether component has loaded fully and is error free
  loading: boolean = true;
  loadingError: boolean = false;
  // property to store data retreived from server
  protectedData: any;
  // pagination info, modified by pagination widget
  totalItems: any;
  currentPage = 1;
  itemsPerPage = 5;
  // whether or not the dialogue has confirmed
  confirm: boolean = false;
  // string to filter user results server-side
  filterByUsername: string = '';
  // fields to send to the filter widget
  filterFields = [{
    keyword: 'username',
    label: 'Username'
  }];

  constructor(
    private _user: UserService,
    private _api: ApiService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    // get observable & set behavior on change
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    // get data from server
    this.refreshData();
  }

  /**
   * Sends request to modify specified user to have a
   * new specified role (e.g. 'Owner', 'Editor', 'User').
   * Then, refreshes user data from the server.
   * 
   * @param username - The name of the user to be modified
   * @param newRole  - Their new role
   */
  alterUserRole(username: any, newRole: any) {
    const requestObj = {
      username: username,
      role: newRole
    };
    // update user
    this._api.putTypeRequest('user/' + username, requestObj).subscribe();
    // refresh data
    this.refreshData();
  }

  /**
   * Executed upon event emission by child filter widget. Copies
   * data from emitted object to filter fields.
   * 
   * @param filterInfo - Object with fields corresponding to each filter
   */
  updateFilter(filterInfo: any) {
    this.filterByUsername = filterInfo.username;
    this.refreshData();
  }

  /**
   * Executed upon event emission from child pagination widget.
   * Gets PageEvent from child widget and applies it to
   * component, then refreshes data.
   * 
   * @param e - PageEvent containing new index and size
   */
  changePagination(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.itemsPerPage = e.pageSize;
    this.refreshData();
  }

  /**
   * Opens the dialogue box to confirm/cancel altering a user's role
   * 
   * @param username - Username of the desired user to alter
   * @param newRole - The new role they will change to
   */
  openDialog(username:string, newRole:string): void {
    // set size and data of dialogue box
    const dialogRef = this.dialog.open(ConfirmRoleChangeDialog, {
      width: '250px',
      data: {username: username, role: newRole},
    });
    // alter user role after closed, if confirmed
    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        this.alterUserRole(username, newRole);
      }
    });
  }

  /**
   * Refreshes data from server and stores in .protectedData. Uses
   * pagination and filter information to only retrieve pertinent items.
   * Also calculates total number of items and sets loading to false.
   */
  refreshData() {
    let requestString: string = 'user/?';
    // add in relevant pagination & username to filter server request
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByUsername) {
      requestString += '&username=' + this.filterByUsername;
    }
    // make request, get total numbrer of items, and untoggle loading
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.protectedData = res.rows;
      this.totalItems = res.count;
      this.loading = false;
    });
  }
}

@Component({
  selector: 'users-confirm-role-change-dialog',
  templateUrl: 'role-change.dialogue.html',
})
export class ConfirmRoleChangeDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmRoleChangeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
