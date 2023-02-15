import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-list-disciplines-view',
  templateUrl: './list-disciplines-view.component.html',
  styleUrls: ['./list-disciplines-view.component.scss']
})
export class ListDisciplinesViewComponent implements OnInit {
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
