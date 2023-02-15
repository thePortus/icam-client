import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

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

  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  protectedData: any;
  totalItems: any;
  currentPage = 1;
  itemsPerPage = 5;
  confirm: boolean = false;
  filterByUsername: string = '';

  constructor(
    private _user: UserService,
    private _api: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.refreshData();
  }

  alterUserRole(username: any, newRole: any) {
    const authorizingId = this.user.username;
    const requestObj = {
      authorizingId: authorizingId,
      username: username,
      role: newRole
    };
    this._api.putTypeRequest('user/' + username, requestObj).subscribe();
    this.refreshData();
  }

  changePagination(paginationData: any) {
    this.currentPage = paginationData.page;
    this.itemsPerPage = paginationData.size;
    this.refreshData();
  }

  openDialog(username:string, newRole:string): void {
    const dialogRef = this.dialog.open(ConfirmRoleChangeDialog, {
      width: '250px',
      data: {username: username, role: newRole},
    });

    dialogRef.afterClosed().subscribe((results) => {
      if (results == true) {
        this.alterUserRole(username, newRole);
      }
    });
  }

  refreshData() {
    let requestString: string = 'user/?';
    requestString += 'page=' + (this.currentPage - 1) +  '&size=' + this.itemsPerPage;
    if (this.filterByUsername) {
      requestString += '&username=' + this.filterByUsername;
    }
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
