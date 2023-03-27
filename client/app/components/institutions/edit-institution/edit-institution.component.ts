import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-edit-institution',
  templateUrl: './edit-institution.component.html',
  styleUrls: ['./edit-institution.component.scss']
})
export class EditInstitutionComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // id of item to edit
  @Input() institutionId = '';

  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // storage for current item data from server
  protectedData: any;
  // currently selected items for drop-drown menus
  selectedLocation: any = null;
  selectedType = 'University';
  selectedFunding = 'Public';
  // possible choices for drop-down menus
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
    private _router: Router,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Gets user details. Gets current item information from the server.
   * Sets .loading flag to false.
   */
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

  /**
   * Ensures request meets basic validation and outputs client-side
   * error messages if it does not.
   * 
   * @param reqObject - The data JSON to be sent
   * @returns true if object is valid, otherwise null
   */
  private _validate(reqObject: any): boolean {
    var isValid = true;
    this.errorMsgs = [];
    if (reqObject.title == '' || reqObject.title.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('Title cannot be blank or a space');
      isValid = false;
    }
    return isValid;
  }

  /**
   * Cycles through each property in the req object and if it is a string,
   * trim and leading or trailing whitespaces.
   * 
   * @param objectToTrim - The request object, with data to send
   * @returns A request object, with any strings trimmed of leading/trailing whitespace
   */
  trimReqObject(objectToTrim: any) {
    Object.keys(objectToTrim).forEach(property => {
      if (typeof objectToTrim[property] == 'string') {
        objectToTrim[property] = objectToTrim[property].trim();
      }
    });
    return objectToTrim;
  }

  /**
   * Submits user data to server and stores local user data from server response.
   * 
   * @param form Form data
   */
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
          this._snackBar.open('Item successfully updated!', '', { duration: 3000 });
          // navigate to disciplines
          this._router.navigate(['/institutions/' + this.protectedData.id]);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  /**
   * Called by HTML template, sets specified location as selected item
   * 
   * @param selectedLocation - Object with location data
   */
  locationSelected(selectedLocation: any) {
    this.selectedLocation = selectedLocation;
  }

}
