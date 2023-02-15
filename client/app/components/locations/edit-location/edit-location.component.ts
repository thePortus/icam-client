import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { States } from '../states';
import { Countries } from '../countries';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() locationId = '';

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  protectedData: any;
  selectedState = 'Arizona';
  selectedCountry = 'United States';
  acceptableStates = States;
  acceptableCountries = Countries;

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this._api.getTypeRequest('locations/' + this.locationId).subscribe((res: any) => {
      this.protectedData = res;
      this.selectedState = this.protectedData.state;
      this.selectedCountry = this.protectedData.country;
      this.loading = false;
    });
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

  onSubmit(form: any) {
    var reqObject = {
      id: this.protectedData.id,
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
    if (reqObject.title == '') {
      reqObject.title = reqObject.city + ', ' + reqObject.state;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.putTypeRequest('locations/' + this.protectedData.id.toString(), reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          alert('Item successfully updated!');
          // navigate to locations
          this._router.navigate(['/locations/' + this.protectedData.id]);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

}
