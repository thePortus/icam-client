import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Institution } from './../../../interfaces/institution.interface';
import { Person } from './../../../interfaces/person.interface';

// info for linking people to panel
interface PresenterToLink {
  panelId: number;
  personId: number;
  isRespondent: boolean;
}

// info for linking people to panel as a presenter
interface PresenterAffiliationToLink {
  panelId: number;
  personId: number;
  institutionId: number;
}

@Component({
  selector: 'app-edit-presentation',
  templateUrl: './edit-presentation.component.html',
  styleUrls: ['./edit-presentation.component.scss']
})
export class EditPresentationComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // id of item to edit
  @Input() presentationId = '';

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
    private _router: Router,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Gets user details. Gets current item information from the server,
   * adds info on any linked items to their respective storage spots.
   * Gets all current people and institutions from the server, for
   * use in selecting people and institutions to link.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this._api.getTypeRequest('presentations/' + this.presentationId).subscribe((res: any) => {
      this.protectedData = res;
      this.selectedPanel = {
        id: this.protectedData.panel.id,
        title: this.protectedData.panel.title
      };

      this.protectedData.oldPresenters = res.presenters;
      this.protectedData.oldTopics = res.topics;
      this.protectedData.oldGeographies = res.geographies;
      this.protectedData.oldPresenterAffiliations = [];
      for (let presenter of res.presenters) {
        this.presentersToLink.push({
          presentationId: this.protectedData.id,
          personId: presenter.presenterLink.personId,
          name: presenter.presenterLink.name,
          isRespondent: presenter.presenterLink.isRespondent
        });
        for (let presenterAffiliation of presenter.affiliationsAsPresenter) {
          // only copy affiliations associated with this specific presentation
          if (presenterAffiliation.presenterAffiliationLink.presentationId == this.protectedData.id) {
            this.protectedData.oldPresenterAffiliations.push({
              presentationId: this.protectedData.id,
              personId: presenter.id,
              institutionId: presenterAffiliation.id,
              department: presenterAffiliation.presenterAffiliationLink.department
            });
            this.presenterAffiliationsToLink.push({
              presentationId: this.protectedData.id,
              personId: presenter.id,
              institutionId: presenterAffiliation.id,
              department: presenterAffiliation.presenterAffiliationLink.department
            });
          }
        }
      }
      for (let topic of res.topics) {
        this.topicsToLink.push({
          id: topic.id,
          title: topic.title
        });
      }
      for (let geography of res.geographies) {
        this.placesToLink.push({
          id: geography.id,
          title: geography.title
        });
      }
      // get acceptable peple
      this._api.getTypeRequest('people/').subscribe((res: any) => {
        this.acceptablePeople = res.sort(function(a:any, b:any) {
          // sort list of people alphabetically by title
          var textA = null;
          var textB = null;
          if (a.name) {
            textA = a.name.toUpperCase();
          }
          if (b.name) {
            textB = b.name.toUpperCase();
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
   * Also removes all previous linked item information, then re-adds new linked items.
   * 
   * @param form Form data
   */
  onSubmit(form: any) {
    var reqObject = {
      id: this.protectedData.id,
      title: this.protectedData.title,
      panelId: null,
      description: this.protectedData.description,
      text: this.protectedData.text
    };
    if (this.selectedPanel) {
      reqObject.panelId = this.selectedPanel.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.putTypeRequest('presentations/' + this.protectedData.id.toString(), reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          // remove old presenter affiliations
          for (let presenterAffiliationToRemove of this.protectedData.oldPresenterAffiliations) {
            this._api.deleteTypeRequest('presenter-affiliations/' + this.protectedData.id.toString() + '/' + presenterAffiliationToRemove.personId.toString() + '/' + presenterAffiliationToRemove.institutionId.toString()).subscribe(() => {

            });
          }
          // remove old presenters
          for (let presenterToRemove of this.protectedData.oldPresenters) {
            this._api.deleteTypeRequest('people-presenting/' + this.protectedData.id.toString() + '/' + presenterToRemove.id.toString()).subscribe(() => {

            });
          }
          // remove old topics
          for (let topicToRemove of this.protectedData.oldTopics) {
            this._api.deleteTypeRequest('presentation-topics/' + this.protectedData.id.toString() + '/' + topicToRemove.id.toString()).subscribe(() => {

            });
          }
          // remove old geographies
          for (let geographyToRemove of this.protectedData.oldGeographies) {
            this._api.deleteTypeRequest('presentation-geographies/' + this.protectedData.id.toString() + '/' + geographyToRemove.id.toString()).subscribe(() => {

            });
          }
          // link presenters
          for (let presenterToLink of this.presentersToLink) {
            const presenterLinkReqObject = {
              personId: presenterToLink.personId,
              presentationId: this.protectedData.id,
              name: presenterToLink.name,
              isRespondent: presenterToLink.isRespondent
            };
            this._api.postTypeRequest('people-presenting', presenterLinkReqObject).subscribe();
          }
          // link presenter affiliations
          for (let presenterAffiliationToLink of this.presenterAffiliationsToLink) {
            const presenterAffiliationLinkReqObject = {
              presenterId: presenterAffiliationToLink.personId,
              presentationId: this.protectedData.id,
              institutionId: presenterAffiliationToLink.institutionId,
              department: presenterAffiliationToLink.department
            };
            this._api.postTypeRequest('presenter-affiliations', presenterAffiliationLinkReqObject).subscribe();
          }
          // link topics
          for (let topicToLink of this.topicsToLink) {
            const topicLinkReqObject = {
              presentationId: this.protectedData.id,
              topicId: topicToLink.id
            };
            this._api.postTypeRequest('presentation-topics', topicLinkReqObject).subscribe();
          }
          // link places
          for (let placeToLink of this.placesToLink) {
            const placeLinkReqObject = {
              presentationId: this.protectedData.id,
              geographyId: placeToLink.id
            };
            this._api.postTypeRequest('presentation-geographies', placeLinkReqObject).subscribe();
          }
          this._snackBar.open('Item successfully updated!', '', { duration: 3000 });
          // navigate to disciplines
          this._router.navigate(['/presentations/' + this.protectedData.id]);
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
        name: person.name,
        isRespondent: person.isRespondent
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

  getPresenterNameById(personId: number){
    for (let person of this.acceptablePeople) {
      if (personId == person.id) {
        return person.name;
      }
    }
    return null;
  }

  /**
   * Helper method to provide means of getting a presenters's name by their ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param personId - ID of the presenter
   * @returns String of the name of the presenter, null if not found
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
