import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-list-topics-view',
  templateUrl: './list-topics-view.component.html',
  styleUrls: ['./list-topics-view.component.scss']
})
export class ListTopicsViewComponent implements OnInit {
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
