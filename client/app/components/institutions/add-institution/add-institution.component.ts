import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-add-institution',
  templateUrl: './add-institution.component.html',
  styleUrls: ['./add-institution.component.scss']
})
export class AddInstitutionComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
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
    private _user: UserService
  ) { }

  /**
   * Gets user details and sets .loading flag to false.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.loading = false;
  }

  /**
   * Ensures requests meets basic validation and outputs client-side
   * error messages if not.
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
    if (this.selectedLocation == null) {
      this.errorMsgs.push('Location cannot be blank');
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
  onSubmit(form: NgForm) {
    var reqObject = {
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
      this._api.postTypeRequest('institutions', reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          alert('Institution successfully added!');
          this.successfullyAdded.emit(res);
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
