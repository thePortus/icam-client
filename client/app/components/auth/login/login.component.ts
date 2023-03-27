import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { AuthService } from './../../../services/auth.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // local and server error messages
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _user: UserService,
    private _router: Router
  ) { }

  /**
   * Checks if the user is logged in, and gets user details as an
   * observable if so.
   */
  ngOnInit(): void {
    // check local storage data whether user is already logged in
    this.isUserLogin();
    // get observable & set behavior on change
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
  }

  /**
   * Submits user data to server and stores local user data from server response.
   * 
   * @param form Form data with user login info
   */
  onSubmit(form: NgForm) {
    this.serverErrorMsgs = [];
    this._api.postTypeRequest('user/login', form.value).subscribe((res: any) => {
      // if successful
      if (res.status) {
        // store data in local browser storage for later sessions
        this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
        // store JWT auth token provided by the server
        this._auth.setDataInLocalStorage('token', res.token);
        // store user data in user service for use by application components
        this._user.login({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
          token: res.token
        });
        // navigate home
        this._router.navigate(['']);
      }
      // send error message
      else {
        this.serverErrorMsgs = ['There was a problem logging in, perhaps you entered the wrong username/password'];
      }
    });
  }

  /**
   * Uses auth service to see if user already has stored login data
   * in local storage. If so, then uses the user service to
   * store that data for the application.
   */
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

  /**
   * Clears user data both from user service and from local storage
   */
  logout() {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }

}
