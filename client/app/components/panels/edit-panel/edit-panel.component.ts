import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Institution } from './../../../interfaces/institution.interface';
import { Person } from './../../../interfaces/person.interface';

// info for linking chairs to panel
interface ChairToLink {
  panelId: number;
  personId: number;
  name: string;
  title: string;
}

// info for linking institutions to people as chairs
interface ChairAffiliationToLink {
  panelId: number;
  personId: number;
  institutionId: number;
  department: string;
}

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // id of item to edit
  @Input() panelId = '';

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
  chairsToLink: ChairToLink[] = [];
  chairAffiliationsToLink: ChairAffiliationToLink[] = [];
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
    private _router: Router,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Gets user details. Gets current item information from the server,
   * adds info on any linked items to their respective storage spots.
   * gets all current people and institutions from the server,
   * for use in selecting people and institutions to link.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this._api.getTypeRequest('panels/' + this.panelId).subscribe((res: any) => {
      this.protectedData = res;
      this.selectedType = this.protectedData.type;
      this.selectedConference = {
        id: this.protectedData.conference.id,
        title: this.protectedData.conference.title
      };

      this.protectedData.oldChairs = res.chairs;
      this.protectedData.oldChairAffiliations = [];
      for (let chair of res.chairs) {
        this.chairsToLink.push({
          panelId: this.protectedData.id,
          personId: chair.id,
          name: chair.PersonChairings.name,
          title: chair.PersonChairings.title
        });
        for (let chairAffiliation of chair.affiliationsAsChair) {
          // only copy affiliations associated with this specific panel
          if (chairAffiliation.chairAffiliationLink.panelId == this.protectedData.id) {
            this.protectedData.oldChairAffiliations.push({
              panelId: this.protectedData.id,
              personId: chair.id,
              institutionId: chairAffiliation.id,
              department: chairAffiliation.chairAffiliationLink.department
            });
            this.chairAffiliationsToLink.push({
              panelId: this.protectedData.id,
              personId: chair.id,
              institutionId: chairAffiliation.id,
              department: chairAffiliation.chairAffiliationLink.department
            });
          }
        }
      }
      this._api.getTypeRequest('institutions/').subscribe((institutionRes: any) => {
        this.acceptableInstitutions = institutionRes.sort(function(a:any, b:any) {
          // sort list of institutions alphabetically by title
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
        this.selectedInstitution = this.acceptableInstitutions[0] ? this.acceptableInstitutions[0].id : null;
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
      });
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
    if (reqObject.type == '' || reqObject.type.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('Type cannot be blank or a space');
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
   * Also removes all previous linked item information, then re-adds new linked items.
   * 
   * @param form Form data
   */
  onSubmit(form: any) {
    var reqObject = {
      id: this.protectedData.id,
      title: '',
      conferenceId: null,
      type: this.selectedType
    };
    if (this.selectedConference) {
      reqObject.conferenceId = this.selectedConference.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.putTypeRequest('panels/' + this.protectedData.id.toString(), reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          // remove old chair affiliations
          for (let chairAffiliationToRemove of this.protectedData.oldChairAffiliations) {
            this._api.deleteTypeRequest('chair-affiliations/' + this.protectedData.id.toString() + '/' + chairAffiliationToRemove.personId.toString() + '/' + chairAffiliationToRemove.institutionId.toString()).subscribe(() => {

            });
          }
          // remove old chairs
          for (let chairToRemove of this.protectedData.oldChairs) {
            this._api.deleteTypeRequest('people-chairing/' + chairToRemove.PersonChairings.panelId.toString() + '/' + chairToRemove.id.toString()).subscribe(() => {
            });
          }
          // link panels
          for (let chairToLink of this.chairsToLink) {
            const chairLinkReqObject = {
              personId: chairToLink.personId,
              panelId: chairToLink.panelId,
              name: chairToLink.name,
              title: chairToLink.title
            };
            this._api.postTypeRequest('people-chairing', chairLinkReqObject).subscribe();
          }
          // link chair affililations
          for (let affiliationToLink of this.chairAffiliationsToLink) {
            const affiliationLinkReqObject = {
              chairId: affiliationToLink.personId,
              panelId: affiliationToLink.panelId,
              institutionId: affiliationToLink.institutionId,
              department: affiliationToLink.department
            };
            this._api.postTypeRequest('chair-affiliations', affiliationLinkReqObject).subscribe();
          }
          this._snackBar.open('Item successfully updated!', '', { duration: 3000 });
          // navigate to disciplines
          this._router.navigate(['/panels/' + this.protectedData.id]);
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
    let isDuplicate = false;
    for (let chairToLink of this.chairsToLink) {
      if (chairToLink.personId == person.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.chairsToLink.push({
        personId: person.id,
        panelId: this.protectedData.id,
        name: person.name,
        title: person.title,
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
    let isDuplicate = false;
    for (let chairAffiliationToLink of this.chairAffiliationsToLink) {
      if (chairAffiliationToLink.personId == personId && chairAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.chairAffiliationsToLink.push({
        personId: personId,
        institutionId: institutionId,
        panelId: this.protectedData.id,
        department: affiliationDepartment
      });
    }
    
    this.toggleDisplayChairAffiliation();
  }

  /**
   * Removes a chair that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * @param id - ID of the item
   */
  removeChair(id: number) {
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
      idList.push(chairToLink.personId);
    }
    return idList;
  }

}
