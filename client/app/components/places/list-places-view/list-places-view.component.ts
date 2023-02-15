import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-list-places-view',
  templateUrl: './list-places-view.component.html',
  styleUrls: ['./list-places-view.component.scss']
})
export class ListPlacesViewComponent implements OnInit {
  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;

  constructor(
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.loading = false;
  }

}
