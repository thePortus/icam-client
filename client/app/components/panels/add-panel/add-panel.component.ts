import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Person } from './../../../interfaces/person.interface';
import { Institution } from './../../../interfaces/institution.interface';

@Component({
  selector: 'app-add-panel',
  templateUrl: './add-panel.component.html',
  styleUrls: ['./add-panel.component.scss']
})
export class AddPanelComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // currently selected items for drop down menus
  selectedConference: any = null;
  selectedType = 'General';
  // acceptable items for drop down menu selection
  acceptableTypes = [
    'General', 'Presidental Address', 'Keynote', 'Plenary', 'Workshop', 'Roundtable',
    'Uncertain', 'Other'
  ];
  // toggle flags for displaying ui for linking items
  displayLinkChair: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  // for storing items to link, to be added upon submission
  chairsToLink: any[] =[];
  chairAffiliationsToLink: any[] = [];
  // currently selected items for linking
  selectedPerson: any;
  selectedInstitution: any;
  // acceptable items possible for linking
  acceptablePeople: Person[] = [];
  acceptableInstitutions: Institution[] = [];
  // for the optional department info of an affiliated chair
  affiliationDepartment: string = '';

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Gets user details, gets all current people and institutions
   * from the server, for use in selecting people and institutions
   * to link.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    // get acceptable people
    this._api.getTypeRequest('people/').subscribe((res: any) => {
      this.acceptablePeople = res.sort(function(a:any, b:any) {
        // sort list of people alphabetically by title
        var textA = null;
        var textB = null;
        if (a.title) {
          textA = a.title.toUpperCase();
        }
        if (b.title) {
          textB = b.title.toUpperCase();
        }
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.selectedPerson = this.acceptablePeople[0] ? this.acceptablePeople[0].id : null;
      // get acceptable institutions
      this._api.getTypeRequest('institutions/').subscribe((res: any) => {
        this.acceptableInstitutions = res.sort(function(a:any, b:any) {
          // sort list of institutions alphabetically by title
          var textA = null;
          var textB = null;
          if (a.title) {
            textA = a.title.toUpperCase();
          }
          if (b.title) {
            textB = b.title.toUpperCase();
          }
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.selectedInstitution = this.acceptableInstitutions[0] ? this.acceptableInstitutions[0].id : null;
        this.loading = false;
      });
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
    if (this.selectedConference == null) {
      this.errorMsgs.push('Conference cannot be blank');
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
      conferenceId: null,
      type: this.selectedType,
    };
    if (this.selectedConference) {
      reqObject.conferenceId = this.selectedConference.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.postTypeRequest('panels', reqObject).subscribe((res: any) => {
        // link chairs
        for (let chairToLink of this.chairsToLink) {
          const chairLinkReqObject = {
            personId: chairToLink.personId,
            panelId: res.id,
            name: chairToLink.name,
            title: chairToLink.title
          };
          this._api.postTypeRequest('people-chairing', chairLinkReqObject).subscribe();
        }
        // link chair affiliations
        for (let chairAffiliationToLink of this.chairAffiliationsToLink) {
          const chairAffiliationLinkReqObject = {
            chairId: chairAffiliationToLink.personId,
            panelId: res.id,
            institutionId: chairAffiliationToLink.institutionId,
            department: chairAffiliationToLink.department
          };
          this._api.postTypeRequest('chair-affiliations', chairAffiliationLinkReqObject).subscribe();
        }
        if (res.status !== 0) {
          this._snackBar.open('Panel successfully added!', '', { duration: 3000 });
          this.successfullyAdded.emit(res);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  /**
   * Executed upon event emission from the select conference widget.
   * Gets the selected conferences's data and stores it.
   * 
   * @param selectedConference - Object with conference data
   */
  conferenceSelected(selectedConference: any) {
    this.selectedConference = selectedConference;
  }

  /**
   * Gets chair info from html fields, ensures it has not already
   * been added, then adds it to the list of chairs that will be linked
   * upon submission.
   * 
   * @param person - Object with person data
   */
  linkChair(person: any) {
    // ensure no duplication
    let isDuplicate = false;
    for (let chairToLink of this.chairsToLink) {
      if (chairToLink.personId == person.id) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.chairsToLink.push({
        personId: person.id,
        name: person.name,
        title: person.title
      });
    }
    // if a person was added during selection, requery people and update acceptable people list
    if (person.newPersonWasAdded === true) {
      this._api.getTypeRequest('people/').subscribe((peopleRes: any) => {
        this.acceptablePeople = peopleRes.sort(function(a:any, b:any) {
          // sort list of panels alphabetically by title
          let textA = null;
          let textB = null;
          if (a.title) {
            textA = a.title.toUpperCase();
          }
          if (b.title) {
            textB = b.title.toUpperCase();
          }
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.selectedPerson = this.acceptablePeople[0] ? this.acceptablePeople[0].id : null;
        this.loading = false;
      });
    }
    // hide liking UI
    this.toggleDisplayLinkChair();
  }

  /**
   * Gets affiliation info of a chair from html fields, ensures it has not already
   * been added, then adds it to the list of chairs that will be linked
   * upon submission.
   * 
   * @param personId - ID of person
   * @param institutionId - ID of institution
   * @param affiliationDepartment - String of optional department, string can be empty
   */
  linkChairAffiliation(personId: number, institutionId: number, affiliationDepartment: string) {
    // ensure no duplication
    let isDuplicate = false;
    for (let chairAffiliationToLink of this.chairAffiliationsToLink) {
      if (chairAffiliationToLink.personId == personId && chairAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.chairAffiliationsToLink.push({
        personId: personId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    // hide linking UI
    this.toggleDisplayChairAffiliation();
  }

  /**
   * Removes a chair that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * @param id - ID of the item
   */
  removeChair(id: number) {
    // remove the item
    this.chairsToLink = this.chairsToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  /**
   * Removes an affiliation of a chair that was set to be linked.
   * 
   * @param personId - ID of the chair
   * @param institutionId - ID of the institution
   */
  removeChairAffiliation(personId: number, institutionId: number) {
    // remove the item
    this.chairAffiliationsToLink = this.chairAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  /**
   * Toggles display of UI to link existing chairs
   */
  toggleDisplayLinkChair() {
    this.displayLinkChair = !this.displayLinkChair;
    if (this.displayLinkChair) {
      this.displayLinkChairAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link affiliations of existing chairs
   */
  toggleDisplayChairAffiliation() {
    this.displayLinkChairAffiliation = !this.displayLinkChairAffiliation;
    if (this.displayLinkChairAffiliation) {
      this.displayLinkChair = false;
    }
  }

  /**
   * Helper method to provide means of getting a chair's name by their ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param personId - ID of the chair
   * @returns String of the name of the chair, null if not found
   */
  getChairNameById(personId: number){
    for (let person of this.acceptablePeople) {
      if (personId == person.id) {
        return person.name;
      }
    }
    return null;
  }

  /**
   * Helper method to provide means of getting an institution's title by its ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param institutionId - ID of the institution
   * @returns String of the name of the institution, null if not found
   */
  getInstitutionTitleById(institutionId: number){
    for (let institution of this.acceptableInstitutions) {
      if (institutionId == institution.id) {
        return institution.title;
      }
    }
    return null;
  }

  /**
   * Returns a list of data that only includes those who have already been
   * linked. Used by portions of the HTML template for associating institutions
   * with chairs. This ensures that institutions can only be linked
   * with those already added to the chair list.
   * 
   * @returns Array of objects, each with a chair's data
   */
  filterChairsByLinked() {
    let idsToFilter = [];
    let filteredChairs: any[] = [];
    for (let chairToLink of this.chairsToLink) {
      idsToFilter.push(chairToLink.personId);
    }
    for (let acceptableChair of this.acceptablePeople) {
      if (idsToFilter.includes(acceptableChair.id)) {
        filteredChairs.push(acceptableChair);
      }
    }
    return filteredChairs;
  }

  /**
   * Helper function that provides an array of IDs of the current
   * chairs set to be linked.
   * 
   * @returns Array of chair ids
   */
  linkedChairIds() {
    let idList: number[] = [];
    for (let chairToLink of this.chairsToLink) {
      idList.push(chairToLink.id);
    }
    return idList;
  }

}
