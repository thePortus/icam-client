import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Person } from './../../../interfaces/person.interface';
import { Institution } from './../../../interfaces/institution.interface';

@Component({
  selector: 'app-add-presentation',
  templateUrl: './add-presentation.component.html',
  styleUrls: ['./add-presentation.component.scss']
})
export class AddPresentationComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // currently selected panel
  selectedPanel: any = null;
  // toggle flags for displaying ui for linking items
  displayLinkPresenter: boolean = false;
  displayLinkPresenterAffiliation: boolean = false;
  displayLinkPlace: boolean = false;
  displayLinkTopic: boolean = false;
  // for storing items to link, to be added upon submission
  presentersToLink: any[] =[];
  presenterAffiliationsToLink: any[] = [];
  placesToLink: any[] = [];
  topicsToLink: any[] = [];
  // stores selected items for adding to linked items
  selectedTopic: any;
  selectedPlace: any;
  selectedPerson: any;
  selectedInstitution: any;
  // stores ids of alraedy selected items
  selectedPlaceIds: number[] = [];
  selectedTopicIds: number[] = [];
  // for storing list of possible items to select from
  acceptablePeople: Person[] = [];
  acceptableInstitutions: Institution[] = [];
  // for the optional department info of an affiliated presenter
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
    // get acceptable peple
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
    if (this.selectedPanel == null) {
      this.errorMsgs.push('Panel cannot be blank');
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
      panelId: null,
      description: null,
      text: null
    };
    if (this.selectedPanel) {
      reqObject.panelId = this.selectedPanel.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.postTypeRequest('presentations', reqObject).subscribe((res: any) => {
        // link presenters
        for (let presenterToLink of this.presentersToLink) {
          const presenterLinkReqObject = {
            personId: presenterToLink.personId,
            presentationId: res.id,
            name: presenterToLink.name
          };
          this._api.postTypeRequest('people-presenting', presenterLinkReqObject).subscribe();
        }
        // link presenter affiliations
        for (let presenterAffiliationToLink of this.presenterAffiliationsToLink) {
          const presenterAffiliationLinkReqObject = {
            presenterId: presenterAffiliationToLink.personId,
            presentationId: res.id,
            institutionId: presenterAffiliationToLink.institutionId,
            department: presenterAffiliationToLink.department
          };
          this._api.postTypeRequest('presenter-affiliations', presenterAffiliationLinkReqObject).subscribe();
        }
        // link topics
        for (let topicToLink of this.topicsToLink) {
          const topicLinkReqObject = {
            presentationId: res.id,
            topicId: topicToLink.id
          };
          this._api.postTypeRequest('presentation-topics', topicLinkReqObject).subscribe();
        }
        // link places
        for (let placeToLink of this.placesToLink) {
          const placeLinkReqObject = {
            presentationId: res.id,
            geographyId: placeToLink.id
          };
          this._api.postTypeRequest('presentation-geographies', placeLinkReqObject).subscribe();
        }
        if (res.status !== 0) {
          this._snackBar.open('Topic successfully added!', '', { duration: 3000 });
          this.successfullyAdded.emit(res);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  /**
   * Executed upon event emission from the select panel widget.
   * Gets the selected panels's data and stores it.
   * 
   * @param selectedPanel - Object with panel data
   */
  panelSelected(selectedPanel: any) {
    this.selectedPanel = selectedPanel;
  }

  /**
   * Executed upon event emission from the select topic widget.
   * Gets the selected topics's data and stores it.
   * 
   * @param selectedTopic - Object with panel data
   */
  topicSelected(selectedTopic: any) {
    this.topicsToLink.push({
      id: selectedTopic.id,
      title: selectedTopic.title
    });
    this.selectedTopicIds.push(selectedTopic.id);
    // remove any duplicate topics
    this.topicsToLink = [...new Set(this.topicsToLink)];
    this.displayLinkTopic = false;
  }

  /**
   * Executed upon event emission from the select place widget.
   * Gets the selected place's data and stores it.
   * 
   * @param selectedPlace - Object with panel data
   */
  placeSelected(selectedPlace: any) {
    this.placesToLink.push({
      id: selectedPlace.id,
      title: selectedPlace.title
    });
    this.selectedPlaceIds.push(selectedPlace.id);
    // remove any duplicate plaes
    this.placesToLink = [...new Set(this.placesToLink)];
    this.displayLinkPlace = false;
  }

  /**
   * Gets presenter info from html fields, ensures it has not already
   * been added, then adds it to the list of presenters that will be linked
   * upon submission.
   * 
   * @param person - Object with person data
   */
  linkPresenter(person: any) {
    let isDuplicate = false;
    for (let presenterToLink of this.presentersToLink) {
      if (presenterToLink.personId == person.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.presentersToLink.push({
        personId: person.id,
        name: person.name
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
    this.toggleDisplayLinkPresenter();
  }

  /**
   * Gets affiliation info of a presenter from html fields, ensures it has not already
   * been added, then adds it to the list of presenters that will be linked
   * upon submission.
   * 
   * @param personId - ID of person
   * @param institutionId - ID of institution
   * @param affiliationDepartment - String of optional department, string can be empty
   */
  linkPresenterAffiliation(personId: number, institutionId: number, affiliationDepartment: string) {
    let isDuplicate = false;
    for (let presenterAffiliationToLink of this.presenterAffiliationsToLink) {
      if (presenterAffiliationToLink.personId == personId && presenterAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.presenterAffiliationsToLink.push({
        personId: personId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayPresenterAffiliation();
  }

  /**
   * Removes a presenter that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * @param id - ID of the item
   */
  removePresenter(id: number) {
    this.presentersToLink = this.presentersToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  /**
   * Removes an affiliation of a presenter that was set to be linked.
   * 
   * @param personId - ID of the presenter
   * @param institutionId - ID of the institution
   */
  removePresenterAffiliation(personId: number, institutionId: number) {
    this.presenterAffiliationsToLink = this.presenterAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  /**
   * Removes a topic that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * @param id - ID of the item
   */
  removeTopic(id: number) {
    this.topicsToLink = this.topicsToLink.filter(obj => {
      return obj.id != id;
    });
    this.selectedTopicIds = this.selectedTopicIds.filter(element => {
      return element != id;
    });
  }

  /**
   * Removes a place that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * @param id - ID of the item
   */
  removePlace(id: number) {
    this.placesToLink = this.placesToLink.filter(obj => {
      return obj.id != id;
    });
    this.selectedPlaceIds = this.selectedPlaceIds.filter(element => {
      return element != id;
    });
  }

  /**
   * Toggles display of UI to link existing presenters
   */
  toggleDisplayLinkPresenter() {
    this.displayLinkPresenter = !this.displayLinkPresenter;
    if (this.displayLinkPresenter) {
      this.displayLinkPresenterAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link affiliations of existing presenters
   */
  toggleDisplayPresenterAffiliation() {
    this.displayLinkPresenterAffiliation = !this.displayLinkPresenterAffiliation;
    if (this.displayLinkPresenterAffiliation) {
      this.displayLinkPresenter = false;
    }
  }

  /**
   * Toggles display of UI to link existing topics
   */
  toggleDisplayLinkTopic() {
    this.displayLinkTopic = !this.displayLinkTopic;
  }

  /**
   * Toggles display of UI to link existing plaecs
   */
  toggleDisplayLinkPlace() {
    this.displayLinkPlace = !this.displayLinkPlace;
  }

  /**
   * Helper method to provide means of getting a presenters's name by their ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param personId - ID of the presenter
   * @returns String of the name of the presenter, null if not found
   */
  getPresenterNameById(personId: number){
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
   * with presenters. This ensures that institutions can only be linked
   * with those already added to the presenters list.
   * 
   * @returns Array of objects, each with a presenter's data
   */
  filterPresentersByLinked() {
    let idsToFilter = [];
    let filteredPresenters: any[] = [];
    for (let presenterToLink of this.presentersToLink) {
      idsToFilter.push(presenterToLink.personId);
    }
    for (let acceptablePresenter of this.acceptablePeople) {
      if (idsToFilter.includes(acceptablePresenter.id)) {
        filteredPresenters.push(acceptablePresenter);
      }
    }
    return filteredPresenters;
  }

  /**
   * Helper function that provides an array of IDs of the current
   * presenters set to be linked.
   * 
   * @returns Array of presenter's ids
   */
  linkedPresenterIds() {
    let idList: number[] = [];
    for (let presenterToLink of this.presentersToLink) {
      idList.push(presenterToLink.id);
    }
    return idList;
  }

}
