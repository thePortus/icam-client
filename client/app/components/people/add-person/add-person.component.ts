import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Panel } from './../../../interfaces/panel.interface';
import { Presentation } from './../../../interfaces/presentation.interface';
import { Institution } from './../../../interfaces/institution.interface';
import { Conference } from './../../../interfaces/conference.interface';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
  // toggle which determines if optional ui for "roles" is displayed with person selection
  @Input() simplifiedView: boolean = false;
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // toggle flags for displaying ui for linking items
  displayLinkConference: boolean = false;
  displayLinkPanel: boolean = false;
  displayLinkPresentation: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  displayLinkPresenterAffiliation: boolean = false;
  displayLinkParticipantAffiliation: boolean = false;
  // for storing items to link, to be added upon submission
  conferencesToLink: any[] = [];
  panelsToLink: any[] = [];
  presentationsToLink: any[] = [];
  chairAffiliationsToLink: any[] = [];
  presenterAffiliationsToLink: any[] = [];
  participantAffiliationsToLink: any[] = [];
  // currently selected items
  selectedConference: any;
  selectedPanel: any;
  selectedPresentation: any;
  selectedInstitution: any;
  // for storing list of possible items to select from
  acceptableConferences: Conference[] = [];
  acceptablePanels: Panel[] = [];
  acceptablePresentations: Presentation[] = [];
  acceptableInstitutions: Institution[] = [];
  // for the optional department info of an affiliated person
  chairAffiliationDepartment: string = '';
  presenterAffiliationDepartment: string = '';
  participantAffiliationDepartment: string = '';

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Gets user details. Gets all current panels, presentations,
   * and conferences for using in selecting items to link.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    // get acceptable panels
    this._api.getTypeRequest('panels/').subscribe((res: any) => {
      this.acceptablePanels = res.sort(function(a:any, b:any) {
        // sort list of panels alphabetically by title
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
      this.selectedInstitution = this.acceptablePanels[0] ? this.acceptablePanels[0].id : null;
      // get acceptable presentations
      this._api.getTypeRequest('presentations/').subscribe((res: any) => {
        this.acceptablePresentations = res.sort(function(a:any, b:any) {
          // sort list of presentations alphabetically by title
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
        this.selectedInstitution = this.acceptablePresentations[0] ? this.acceptablePresentations[0].id : null;
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
          this._api.getTypeRequest('conferences/').subscribe((conferenceRes: any) => {
            this.acceptableConferences = conferenceRes.sort(function(a:any, b:any) {
              // sort list of conferences alphabetically by title
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
            this.selectedConference = this.acceptableConferences[0] ? this.acceptableConferences[0].id : null;
            this.loading = false;
          });
        });
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
    if (reqObject.name == '' || reqObject.name.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('Name cannot be blank or a space');
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
      name: '',
      orcid: '',
    };
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.postTypeRequest('people', reqObject).subscribe((personRes: any) => {
        // link conferences
        for (let conferenceToLink of this.conferencesToLink) {
          const conferenceLinkReqObject = {
            personId: personRes.id,
            conferenceId: conferenceToLink.conferenceId,
            name: conferenceToLink.name,
            role: conferenceToLink.role
          };
          this._api.postTypeRequest('people-participating', conferenceLinkReqObject).subscribe();
        }
        // link panels
        for (let panelToLink of this.panelsToLink) {
          const panelLinkReqObject = {
            personId: personRes.id,
            panelId: panelToLink.panelId,
            name: panelToLink.name,
            title: panelToLink.title
          };
          this._api.postTypeRequest('people-chairing', panelLinkReqObject).subscribe();
        }
        // link presentations
        for (let presentationToLink of this.presentationsToLink) {
          const presentationLinkReqObject = {
            personId: personRes.id,
            presentationId: presentationToLink.presentationId,
            name: presentationToLink.name || null
          };
          this._api.postTypeRequest('people-presenting', presentationLinkReqObject).subscribe();
        }
        // link chair affililations
        for (let affiliationToLink of this.chairAffiliationsToLink) {
          const affiliationLinkReqObject = {
            chairId: personRes.id,
            panelId: affiliationToLink.panelId,
            institutionId: affiliationToLink.institutionId,
            department: affiliationToLink.department
          };
          this._api.postTypeRequest('chair-affiliations', affiliationLinkReqObject).subscribe();
        }
        // link presenter affililations
        for (let affiliationToLink of this.presenterAffiliationsToLink) {
          const affiliationLinkReqObject = {
            presenterId: personRes.id,
            presentationId: affiliationToLink.presentationId,
            institutionId: affiliationToLink.institutionId,
            department: affiliationToLink.department
          };
          this._api.postTypeRequest('presenter-affiliations', affiliationLinkReqObject).subscribe();
        }
        // link participant affiliations
        for (let affiliationToLink of this.participantAffiliationsToLink) {
          const affiliationLinkReqObject = {
            personId: personRes.id,
            conferenceId: affiliationToLink.conferenceId,
            institutionId: affiliationToLink.institutionId,
            department: affiliationToLink.department
          };
          this._api.postTypeRequest('participant-affiliations', affiliationLinkReqObject).subscribe(res => {
          });
        }
        if (personRes.status !== 0) {
          this._snackBar.open('Person successfully added!', '', { duration: 3000 });
          this.successfullyAdded.emit(personRes);
        }
        else {
          this.serverErrorMsgs = personRes.messages;
        }
      });
    }
  }

  /**
   * Gets conference info from html fields, ensures it has not already
   * been added, then adds it to the list of conferences that will be linked
   * upon submission.
   * 
   * @param conference - Object with conference data
   */
  linkConference(conference: any) {
    // ensure no duplication
    let isDuplicate = false;
    for (let conferenceToLink of this.conferencesToLink) {
      if (conferenceToLink.conferenceId == conference.id) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.conferencesToLink.push({
        conferenceId: conference.id,
        name: conference.name || null,
        role: conference.role || null
      });
    }
    // hide linking UI
    this.toggleDisplayLinkConference();
  }

  /**
   * Gets panel info from html fields, ensures it has not already
   * been added, then adds it to the list of panel that will be linked
   * upon submission.
   * 
   * @param panel - Object with panel data
   */
  linkPanel(panel: any) {
    // ensure no duplication
    let isDuplicate = false;
    for (let panelToLink of this.panelsToLink) {
      if (panelToLink.panelId == panel.id) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.panelsToLink.push({
        panelId: panel.id,
        name: panel.personName || null,
        title: panel.personTitle || null
      });
    }
    // hide linking UI
    this.toggleDisplayLinkPanel();
  }

  /**
   * Gets presentation info from html fields, ensures it has not already
   * been added, then adds it to the list of presentations that will be linked
   * upon submission.
   * 
   * @param presentation - Object with presentation data
   */
  linkPresentation(presentation: any) {
    // ensure no duplication
    let isDuplicate = false;
    for (let presentationToLink of this.presentationsToLink) {
      if (presentationToLink.presentationId == presentation.id) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.presentationsToLink.push({
        presentationId: presentation.id,
        name: presentation.personName || null
      });
    }
    // hide linking UI
    this.toggleDisplayLinkPresentation();
  }

  /**
   * Gets chair affiliation info from html fields, ensures it has not already
   * been added, then adds it to the list of affiliations that will be linked
   * upon submission.
   * 
   * @param panelId - ID of panel
   * @param institutionId - ID of department
   * @param affiliationDepartment - String of department, can be an empty string
   */
  linkChairAffiliation(panelId: number, institutionId: number, affiliationDepartment: string) {
    // ensure no duplication
    let isDuplicate = false;
    for (let chairAffiliationToLink of this.chairAffiliationsToLink) {
      if (chairAffiliationToLink.panelId == panelId && chairAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.chairAffiliationsToLink.push({
        panelId: panelId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    // hide linking UI
    this.toggleDisplayChairAffiliation();
  }

  /**
   * Gets presenter affiliation info from html fields, ensures it has not already
   * been added, then adds it to the list of affiliations that will be linked
   * upon submission.
   * 
   * @param presentationId - ID of the presentation
   * @param institutionId - ID of the institution
   * @param affiliationDepartment - String of department, can be an empty string
   */
  linkPresenterAffiliation(presentationId: number, institutionId: number, affiliationDepartment: string) {
    // ensure no duplication
    let isDuplicate = false;
    for (let presenterAffiliationToLink of this.presenterAffiliationsToLink) {
      if (presenterAffiliationToLink.presentationId == presentationId && presenterAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.presenterAffiliationsToLink.push({
        presentationId: presentationId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    // hide linking UI
    this.toggleDisplayPresenterAffiliation();
  }

  /**
   * Gets participant affiliation info from html fields, ensures it has not already
   * been added, then adds it to the list of affiliations that will be linked
   * upon submission.
   * 
   * @param conferenceId - ID of conference
   * @param institutionId - ID of institution
   * @param affiliationDepartment - String of department, can be an empty string
   */
  linkParticipantAffiliation(conferenceId: number, institutionId: number, affiliationDepartment: string) {
    // ensure no duplication
    let isDuplicate = false;
    for (let participantAffiliationToLink of this.participantAffiliationsToLink) {
      if (participantAffiliationToLink.conferenceId == conferenceId && participantAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.participantAffiliationsToLink.push({
        conferenceId: conferenceId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    // hide linking UI
    this.toggleDisplayParticipantAffiliation();
  }

  /**
   * Removes a conference that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removeConference(id: number) {
    // remove item
    this.conferencesToLink = this.conferencesToLink.filter(obj => {
      return obj.id != id;
    });
  }

  /**
   * Removes a panel that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removePanel(id: number) {
    // remove item
    this.panelsToLink = this.panelsToLink.filter(obj => {
      return obj.id != id;
    });
  }

  /**
   * Removes a presentation that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removePresentation(id: number) {
    // remove item
    this.presentationsToLink = this.presentationsToLink.filter(obj => {
      return obj.id != id;
    });
  }

  /**
   * Removes the affiliation of a chair that was set to be linked.
   * 
   * @param panelId - ID of the panel
   * @param institutionId - ID of the institution
   */
  removeChairAffiliation(panelId: number, institutionId: number) {
    // remove item
    this.chairAffiliationsToLink = this.chairAffiliationsToLink.filter(obj => {
      return obj.panelId != panelId || obj.institutionId != institutionId;
    });
  }

  /**
   * Removes the affiliation of a presenter that was set to be linked.
   * 
   * @param presentationId - ID of the presentation
   * @param institutionId - ID of the institution
   */
  removePresentationAffiliation(presentationId: number, institutionId: number) {
    // remove item
    this.presenterAffiliationsToLink = this.presenterAffiliationsToLink.filter(obj => {
      return obj.presentationId != presentationId || obj.institutionId != institutionId;
    });
  }

  /**
   * Removes the affiliation of a participant that was set to be linked.
   * 
   * @param conferenceId - ID of the conference
   * @param institutionId - ID of the institution
   */
  removeParticipantAffiliation(conferenceId: number, institutionId: number) {
    // remove item
    this.participantAffiliationsToLink = this.participantAffiliationsToLink.filter(obj => {
      return obj.conferenceId != conferenceId || obj.institutionId != institutionId;
    });
  }

  /**
   * Toggles display of UI to link existing conferences
   */
  toggleDisplayLinkConference() {
    this.displayLinkConference = !this.displayLinkConference;
    if (this.displayLinkConference) {
      this.displayLinkPresentation = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPresenterAffiliation = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link existing panels
   */
  toggleDisplayLinkPanel() {
    this.displayLinkPanel = !this.displayLinkPanel;
    if (this.displayLinkPanel) {
      this.displayLinkPresentation = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPresenterAffiliation = false;
      this.displayLinkConference = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link existing presentations
   */
  toggleDisplayLinkPresentation() {
    this.displayLinkPresentation = !this.displayLinkPresentation;
    if (this.displayLinkPresentation) {
      this.displayLinkPanel = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPresenterAffiliation = false;
      this.displayLinkConference = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link chair affiliations
   */
  toggleDisplayChairAffiliation() {
    this.displayLinkChairAffiliation = !this.displayLinkChairAffiliation;
    if (this.displayLinkChairAffiliation) {
      this.displayLinkPresentation = false;
      this.displayLinkPanel = false;
      this.displayLinkPresenterAffiliation = false;
      this.displayLinkConference = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link presenter affiliations
   */
  toggleDisplayPresenterAffiliation() {
    this.displayLinkPresenterAffiliation = !this.displayLinkPresenterAffiliation;
    if (this.displayLinkPresenterAffiliation) {
      this.displayLinkPresentation = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPanel = false;
      this.displayLinkConference = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link participant affiliations
   */
  toggleDisplayParticipantAffiliation() {
    this.displayLinkParticipantAffiliation = !this.displayLinkParticipantAffiliation;
    if (this.displayLinkParticipantAffiliation) {
      this.displayLinkPresentation = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPanel = false;
      this.displayLinkConference = false;
      this.displayLinkPresenterAffiliation = false;
    }
  }

  /**
   * Helper method to provide means of getting a conferences's title by its ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param conferenceId - ID of the conference
   * @returns String of the name of the conference, null if not found
   */
  getConferenceTitleById(conferenceId: number){
    for (let conference of this.acceptableConferences) {
      if (conferenceId == conference.id) {
        return conference.title;
      }
    }
    return null;
  }

  /**
   * Helper method to provide means of getting a panel's title by its ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param panelId - ID of the panel
   * @returns String of the name of the panel, null if not found
   */
  getPanelTitleById(panelId: number){
    for (let panel of this.acceptablePanels) {
      if (panelId == panel.id) {
        return panel.title;
      }
    }
    return null;
  }

  /**
   * Helper method to provide means of getting a presentation's title by its ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param presentationId - ID of the presentation
   * @returns String of the name of the presentation, null if not found
   */
  getPresentationTitleById(presentationId: number){
    for (let presentation of this.acceptablePresentations) {
      if (presentationId == presentation.id) {
        return presentation.title;
      }
    }
    return null;
  }

  /**
   * Helper method to provide means of getting a institution's title by its ID number.
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
   * Returns a list of data that only includes conferences who have already been
   * linked. Used by portions of the HTML template for associating items with person.
   * This ensures that people can only be affiliated with those items already
   * added to set to be linked.
   * 
   * @returns Array of objects, each with a participant's data
   */
  filterConferencesByLinked() {
    let idsToFilter = [];
    let filteredConferences: any[] = [];
    for (let conferenceToLink of this.conferencesToLink) {
      idsToFilter.push(conferenceToLink.conferenceId);
    }
    for (let acceptableConference of this.acceptableConferences) {
      if (idsToFilter.includes(acceptableConference.id)) {
        filteredConferences.push(acceptableConference);
      }
    }
    return filteredConferences;
  }
  
  /**
   * Returns a list of data that only includes panels who have already been
   * linked. Used by portions of the HTML template for associating items with person.
   * This ensures that people can only be affiliated with those items already
   * added to set to be linked.
   * 
   * @returns Array of objects, each with a participant's data
   */
  filterPanelsByLinked() {
    let idsToFilter = [];
    let filteredPanels: any[] = [];
    for (let panelToLink of this.panelsToLink) {
      idsToFilter.push(panelToLink.panelId);
    }
    for (let acceptablePanel of this.acceptablePanels) {
      if (idsToFilter.includes(acceptablePanel.id)) {
        filteredPanels.push(acceptablePanel);
      }
    }
    return filteredPanels;
  }

  /**
   * Returns a list of data that only includes presentations who have already been
   * linked. Used by portions of the HTML template for associating items with person.
   * This ensures that people can only be affiliated with those items already
   * added to set to be linked.
   * 
   * @returns Array of objects, each with a participant's data
   */
  filterPresentationsByLinked() {
    let idsToFilter = [];
    let filteredPresentations: any[] = [];
    for (let presentationToLink of this.presentationsToLink) {
      idsToFilter.push(presentationToLink.presentationId);
    }
    for (let acceptablePresentation of this.acceptablePresentations) {
      if (idsToFilter.includes(acceptablePresentation.id)) {
        filteredPresentations.push(acceptablePresentation);
      }
    }
    return filteredPresentations;
  }

}
