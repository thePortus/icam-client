import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';
import { Institution } from './../../../interfaces/institution.interface';
import { Panel } from './../../../interfaces/panel.interface';
import { Presentation } from './../../../interfaces/presentation.interface';
import { Conference } from './../../../interfaces/conference.interface';

// info for linking panels to person
interface ChairToLink {
  panelId: number;
  personId: number;
  name: string | null;
  title: string | null;
}

// info for linking presentations to person
interface PresenterToLink {
  presentationId: number;
  personId: number;
  name: string | null;
}

// info for linking conferences to person
interface ConferenceToLink {
  conferenceId: number,
  personId: number,
  name: string | null;
  role: string | null;
}

// info for linking affiliation info about a person linked as chair
interface ChairAffiliationToLink {
  panelId: number;
  personId: number;
  institutionId: number;
  department: string;
}

// info for linking affiliation info about a person linked as presenter
interface PresenterAffiliationToLink {
  presentationId: number;
  personId: number;
  institutionId: number;
  department: string | null;
}

// info for linking affiliation info about a person linked as participant
interface ParticipantAffiliationToLink {
  conferenceId: number;
  personId: number;
  institutionId: number;
  department: string | null;
}

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // id of item to edit
  @Input() personId = '';

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
  // toggle flags for displaying ui for linking items
  displayLinkConference: boolean = false;
  displayLinkPanel: boolean = false;
  displayLinkPresentation: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  displayLinkPresenterAffiliation: boolean = false;
  displayLinkParticipantAffiliation: boolean = false;
  // for storing items to link, to be added upon submission
  conferencesToLink: ConferenceToLink[] = [];
  panelsToLink: ChairToLink[] = [];
  presentationsToLink: PresenterToLink[] = [];
  chairAffiliationsToLink: ChairAffiliationToLink[] = [];
  presenterAffiliationsToLink: PresenterAffiliationToLink[] = [];
  participantAffiliationsToLink: ParticipantAffiliationToLink[] = [];
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
    private _router: Router
  ) { }

  /**
   * Gets user details. Gets current item data from server.
   * Copies info on linked items into respective storage lists.
   * Gets all current panels, presentations, and conferences
   * for using in selecting items to link.
   */
  ngOnInit(): void {
    // get user profile details
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this._api.getTypeRequest('people/' + this.personId).subscribe((res: any) => {
      this.protectedData = res;
      // copy chaired panels, presentations, attended conferences, and institutional affiliations, both into copies to remove at submission and for working list of new links
      this.protectedData.oldChairedPanels = res.chairedPanels;
      // copy chaired panels
      for (let chairedPanel of res.chairedPanels) {
        this.panelsToLink.push({
          panelId: chairedPanel.id,
          personId: this.protectedData.id,
          name: chairedPanel.chairPanelLink.name,
          title: chairedPanel.chairPanelLink.title
        });
      }
      // copy presentations
      this.protectedData.oldPresentations = res.presentations;
      for (let presentation of res.presentations) {
        this.presentationsToLink.push({
          presentationId: presentation.id,
          personId: this.protectedData.id,
          name: presentation.presenterLink.name
        });
      }
      // copy affiliations as participant
      this.protectedData.oldParticipantConferences = res.participantConferences;
      for (let participantConference of res.participantConferences) {
        this.conferencesToLink.push({
          conferenceId: participantConference.id,
          personId: this.protectedData.id,
          name: participantConference.conferenceLink.name,
          role: participantConference.conferenceLink.role
        });
      }
      // copy affiliations as chair
      this.protectedData.oldChairAffiliations = res.affiliationsAsChair;
      for (let chairAffiliation of res.affiliationsAsChair) {
        this.chairAffiliationsToLink.push({
          institutionId: chairAffiliation.id,
          personId: this.protectedData.id,
          panelId: chairAffiliation.chairAffiliationLink.panelId,
          department: chairAffiliation.chairAffiliationLink.department
        });
      }
      // copy affiliations as presenter
      this.protectedData.oldPresenterAffiliations = res.affiliationsAsPresenter;
      for (let presenterAffiliation of res.affiliationsAsPresenter) {
        this.presenterAffiliationsToLink.push({
          institutionId: presenterAffiliation.id,
          personId: this.protectedData.id,
          presentationId: presenterAffiliation.presenterAffiliationLink.presentationId,
          department: presenterAffiliation.presenterAffiliationLink.department
        });
      }
      // copy affiliations as participant
      this.protectedData.oldParticipantAffiliations = res.affiliationsAsParticipant;
      for (let participantAffiliation of res.affiliationsAsParticipant) {
        this.participantAffiliationsToLink.push({
          conferenceId: participantAffiliation.participantAffiliationLink.conferenceId,
          institutionId: participantAffiliation.id,
          personId: this.protectedData.id,
          department: participantAffiliation.participantAffiliationLink.department
        });
      }
      // get all institutions
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
        this.selectedInstitution = this.acceptableInstitutions[0] || null;
        // get all panels
        this._api.getTypeRequest('panels/').subscribe((panelsRes: any) => {
          this.acceptablePanels = panelsRes.sort(function(a:any, b:any) {
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
          // get all presentations
          this._api.getTypeRequest('presentations/').subscribe((presentationsRes: any) => {
            this.acceptablePresentations = presentationsRes.sort(function(a:any, b:any) {
              // sort list of presentations alphabetically by title
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
            // get all conferences
            this._api.getTypeRequest('conferences/').subscribe((conferenceRes: any) => {
              this.acceptableConferences = conferenceRes.sort(function(a:any, b:any) {
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
              this.selectedConference = this.acceptableConferences[0] ? this.acceptableConferences[0].id : null;
              this.loading = false;
            });
          });
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
   * Also removes all previous linked item information, then re-adds new linked items.
   * 
   * @param form Form data
   */
  onSubmit(form: any) {
    var reqObject = {
      id: this.protectedData.id,
      name: '',
      orcid: '',
    };
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    reqObject = this.trimReqObject(reqObject);
    if (this._validate(reqObject)) {
      this._api.putTypeRequest('people/' + this.protectedData.id.toString(), reqObject).subscribe((res: any) => {
        if (res.status !== 0) {
          // remove old chair affiliations
          for (let panelToRemove of this.protectedData.oldChairAffiliations) {
            this._api.deleteTypeRequest('chair-affiliations/' + panelToRemove.chairAffiliationLink.panelId.toString() + '/' + this.protectedData.id.toString() + '/' + panelToRemove.id.toString()).subscribe(() => {

            });
          }
          // remove old presenter affiliations
          for (let presentationToRemove of this.protectedData.oldPresenterAffiliations) {
            this._api.deleteTypeRequest('presenter-affiliations/' + presentationToRemove.presenterAffiliationLink.presentationId.toString() + '/' + this.protectedData.id.toString() + '/' + presentationToRemove.id.toString()).subscribe(() => {

            });
          }
          // remove old participant affiliations
          for (let conferenceToRemove of this.protectedData.oldParticipantAffiliations) {
            this._api.deleteTypeRequest('participant-affiliations/' + conferenceToRemove.participantAffiliationLink.conferenceId.toString() + '/' + this.protectedData.id.toString() + '/' + conferenceToRemove.id.toString()).subscribe(() => {

            });
          }
          // remove old panels chaired
          for (let chairedPanelToRemove of this.protectedData.oldChairedPanels) {
            this._api.deleteTypeRequest('people-chairing/' + chairedPanelToRemove.id.toString() + '/' + this.protectedData.id.toString()).subscribe(() => {

            });
          }
          // remove old presentations given
          for (let presentationToRemove of this.protectedData.oldPresentations) {
            this._api.deleteTypeRequest('people-presenting/' + presentationToRemove.id.toString() + '/' + this.protectedData.id.toString()).subscribe(() => {

            });
          }
          // remove old conferences participated in
          for (let conferenceToRemove of this.protectedData.oldParticipantConferences) {
            this._api.deleteTypeRequest('people-presenting/' + conferenceToRemove.id.toString() + '/' + this.protectedData.id.toString()).subscribe(() => {

            });
          }
          // link panels
          for (let panelToLink of this.panelsToLink) {
            const panelLinkReqObject = {
              personId: panelToLink.personId,
              panelId: panelToLink.panelId,
              name: panelToLink.name,
              title: panelToLink.title
            };
            this._api.postTypeRequest('people-chairing', panelLinkReqObject).subscribe();
          }
          // link presentations
          for (let presentationToLink of this.presentationsToLink) {
            const presentationLinkReqObject = {
              personId: presentationToLink.personId,
              presentationId: presentationToLink.presentationId,
              name: presentationToLink.name || null
            };
            this._api.postTypeRequest('people-presenting', presentationLinkReqObject).subscribe();
          }
          // link conferences
          for (let conferenceToLink of this.conferencesToLink) {
            const conferenceLinkReqObject = {
              personId: conferenceToLink.personId,
              conferenceId: conferenceToLink.conferenceId,
              name: conferenceToLink.name || null,
              role: conferenceToLink.role || null
            };
            this._api.postTypeRequest('people-participating', conferenceLinkReqObject).subscribe();
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
          // link presenter affililations
          for (let affiliationToLink of this.presenterAffiliationsToLink) {
            const affiliationLinkReqObject = {
              presenterId: affiliationToLink.personId,
              presentationId: affiliationToLink.presentationId,
              institutionId: affiliationToLink.institutionId,
              department: affiliationToLink.department
            };
            this._api.postTypeRequest('presenter-affiliations', affiliationLinkReqObject).subscribe();
          }
          // link participant affililations
          for (let affiliationToLink of this.participantAffiliationsToLink) {
            const affiliationLinkReqObject = {
              personId: affiliationToLink.personId,
              conferenceId: affiliationToLink.conferenceId,
              institutionId: affiliationToLink.institutionId,
              department: affiliationToLink.department
            };
            this._api.postTypeRequest('participant-affiliations', affiliationLinkReqObject).subscribe();
          }
          alert('Item successfully updated!');
          // navigate to people
          this._router.navigate(['/people/' + this.protectedData.id]);
        }
        else {
          this.serverErrorMsgs = res.messages;
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
    let isDuplicate = false;
    for (let conferenceToLink of this.conferencesToLink) {
      if (conferenceToLink.conferenceId == conference.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.conferencesToLink.push({
        conferenceId: conference.id,
        personId: this.protectedData.id,
        name: conference.name || null,
        role: conference.role || null
      });
    }
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
    let isDuplicate = false;
    for (let panelToLink of this.panelsToLink) {
      if (panelToLink.panelId == panel.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.panelsToLink.push({
        panelId: panel.id,
        personId: this.protectedData.id,
        name: panel.personName || null,
        title: panel.personTitle || null
      });
    }
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
    let isDuplicate = false;
    for (let presentationToLink of this.presentationsToLink) {
      if (presentationToLink.presentationId == presentation.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.presentationsToLink.push({
        presentationId: presentation.id,
        personId: this.protectedData.id,
        name: presentation.personName || null
      });
    }
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
    let isDuplicate = false;
    for (let chairAffiliationToLink of this.chairAffiliationsToLink) {
      if (chairAffiliationToLink.panelId == panelId && chairAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.chairAffiliationsToLink.push({
        panelId: panelId,
        personId: this.protectedData.id,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
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
    let isDuplicate = false;
    for (let presenterAffiliationToLink of this.presenterAffiliationsToLink) {
      if (presenterAffiliationToLink.presentationId == presentationId && presenterAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.presenterAffiliationsToLink.push({
        presentationId: presentationId,
        personId: this.protectedData.id,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
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
    let isDuplicate = false;
    for (let participantAffiliationToLink of this.participantAffiliationsToLink) {
      if (participantAffiliationToLink.conferenceId == conferenceId && participantAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.participantAffiliationsToLink.push({
        conferenceId: conferenceId,
        personId: this.protectedData.id,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayParticipantAffiliation();
  }

  /**
   * Removes a conference that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removeConference(id: number) {
    this.conferencesToLink = this.conferencesToLink.filter(obj => {
      return obj.conferenceId != id;
    });
  }

  /**
   * Removes a panel that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removePanel(id: number) {
    this.panelsToLink = this.panelsToLink.filter(obj => {
      return obj.panelId != id;
    });
    // remove any related chair affiliations
    this.chairAffiliationsToLink = this.chairAffiliationsToLink.filter(obj => {
      return obj.panelId != id;
    });
  }

  /**
   * Removes a presentation that was set to be linked.
   * 
   * @param id - ID of the item
   */
  removePresentation(id: number) {
    this.presentationsToLink = this.presentationsToLink.filter(obj => {
      return obj.presentationId != id;
    });
    // remove any related chair affiliations
    this.presenterAffiliationsToLink = this.presenterAffiliationsToLink.filter(obj => {
      return obj.presentationId != id;
    });
  }

  /**
   * Removes the affiliation of a chair that was set to be linked.
   * 
   * @param panelId - ID of the panel
   * @param institutionId - ID of the institution
   */
  removeChairAffiliation(panelId: number, institutionId: number) {
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
