import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Settings } from '../../../app.settings';

import { AuthService } from './../../../services/auth.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  settings = Settings;
  menuLinks = [{
    'label': 'Home',
    'path': '',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Conferences',
    'path': '/conferences',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Panels',
    'path': '/panels',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Presentations',
    'path': '/presentations',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'People',
    'path': '/people',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Institutions',
    'path': '/institutions',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Topics',
    'path': '/topics',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Places',
    'path': '/places',
    'requiresLogin': false,
    'requiresEditor': false,
    'requiresOwner': false
  }, {
    'label': 'Disciplines',
    'path': '/disciplines',
    'requiresLogin': true,
    'requiresEditor': true,
    'requiresOwner': false
  }, {
    'label': 'Locations',
    'path': '/locations',
    'requiresLogin': true,
    'requiresEditor': true,
    'requiresOwner': false
  }, {
    'label': 'Export',
    'path': '/export',
    'requiresLogin': true,
    'requiresEditor': true,
    'requiresOwner': false
  }];
  userDetails$: Observable<User>;
  user: any;

  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this.isUserLogin();
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
  }

  isUserLogin() {
    if(this._auth.getUserDetails() != null) {
      const userDetails = JSON.parse(this._auth.getUserDetails()!);
      this._user.login({
        username: userDetails.username,
        email: userDetails.email,
        role: userDetails.role,
        token: userDetails.token
      });
    }
  }

  navigate(path: string) {
    this._router.navigate([path]);
  }

  logout() {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }
}
