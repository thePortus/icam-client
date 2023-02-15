import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { States } from '../states';
import { Countries } from '../countries';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  @Input() simplifiedView: boolean = false;
  @Output() successfullyAdded = new EventEmitter<string>();

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  selectedState = 'Arizona';
  selectedCountry = 'United States';
  acceptableStates = States;
  acceptableCountries = Countries;

  constructor(
    private _api: ApiService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.loading = false;
  }

  private _validate(reqObject: any): boolean {
    var isValid = true;
    this.errorMsgs = [];
    if (reqObject.city == '' || reqObject.city.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('City cannot be blank or a space');
      isValid = false;
    }
    if (reqObject.state == '' || reqObject.state.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('State must be selected or entered');
      isValid = false;
    }
    return isValid;
  }

  // cycles through each property in the req object and if it is a string, trim and leading or trailing whitespaces
  trimReqObject(objectToTrim: any) {
    Object.keys(objectToTrim).forEach(property => {
      if (typeof objectToTrim[property] == 'string') {
        objectToTrim[property] = objectToTrim[property].trim();
      }
    });
    return objectToTrim;
  }

  onSubmit(form: NgForm) {
    var reqObject = {
      title: '',
      city: '',
      state: this.selectedState,
      country: this.selectedCountry
    };
    // delete state and country from form if empty, thus defaulting to selected choices
    if (form.value.state == '' || form.value.state.replace(/\s+/g, ' ') == ' ') {
      delete form.value.state;
    }
    if (form.value.country == '' || form.value.country.replace(/\s+/g, ' ') == ' ') {
      delete form.value.country;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    if (reqObject.title == '') {
      reqObject.title = reqObject.city + ', ' + reqObject.state;
    }
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.postTypeRequest('locations', reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          alert('Location successfully added!');
          this.successfullyAdded.emit(res);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

}
