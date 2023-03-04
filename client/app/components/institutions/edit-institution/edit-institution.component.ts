import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-edit-institution',
  templateUrl: './edit-institution.component.html',
  styleUrls: ['./edit-institution.component.scss']
})
export class EditInstitutionComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() institutionId = '';

  loading: boolean = true;
  loadingError: boolean = false;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  protectedData: any;
  selectedLocation: any = null;
  selectedType = 'University';
  selectedFunding = 'Public';
  acceptableTypes = [
    'University', 'College', 'Research Council', 'Learned Society', 'Other',
    'Uncertain'
  ];
  acceptableFunding = [
    'Public', 'Private', 'Other', 'Uncertain'
  ];

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
    this._api.getTypeRequest('institutions/' + this.institutionId).subscribe((res: any) => {
      this.protectedData = res;
      this.selectedType = this.protectedData.type;
      this.selectedFunding = this.protectedData.funding;
      this.selectedLocation = {
        id: this.protectedData.location.id,
        title: this.protectedData.location.title
      };
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  private _validate(reqObject: any): boolean {
    var isValid = true;
    this.errorMsgs = [];
    if (reqObject.title == '' || reqObject.title.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('Title cannot be blank or a space');
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
      locationId: null,
      type: this.selectedType,
      funding: this.selectedFunding
    };
    if (this.selectedLocation) {
      reqObject.locationId = this.selectedLocation.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.putTypeRequest('institutions/' + this.protectedData.id.toString(), reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          alert('Item successfully updated!');
          // navigate to disciplines
          this._router.navigate(['/institutions/' + this.protectedData.id]);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  locationSelected(selectedLocation: any) {
    this.selectedLocation = selectedLocation;
  }

}
