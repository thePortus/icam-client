import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

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
  @Input() simplifiedView: boolean = false;
  @Output() successfullyAdded = new EventEmitter<string>();

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  displayLinkConference: boolean = false;
  displayLinkPanel: boolean = false;
  displayLinkPresentation: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  displayLinkPresenterAffiliation: boolean = false;
  displayLinkParticipantAffiliation: boolean = false;
  conferencesToLink: any[] = [];
  panelsToLink: any[] = [];
  presentationsToLink: any[] = [];
  chairAffiliationsToLink: any[] = [];
  presenterAffiliationsToLink: any[] = [];
  participantAffiliationsToLink: any[] = [];
  selectedConference: any;
  selectedPanel: any;
  selectedPresentation: any;
  selectedInstitution: any;
  acceptableConferences: Conference[] = [];
  acceptablePanels: Panel[] = [];
  acceptablePresentations: Presentation[] = [];
  acceptableInstitutions: Institution[] = [];
  chairAffiliationDepartment: string = '';
  presenterAffiliationDepartment: string = '';
  participantAffiliationDepartment: string = '';

  constructor(
    private _api: ApiService,
    private _user: UserService
  ) { }

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

  private _validate(reqObject: any): boolean {
    var isValid = true;
    this.errorMsgs = [];
    if (reqObject.name == '' || reqObject.name.replace(/\s+/g, ' ') == ' ') {
      this.errorMsgs.push('Name cannot be blank or a space');
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
            console.log(res);
          });
        }
        if (personRes.status !== 0) {
          alert('Person successfully added!');
          this.successfullyAdded.emit(personRes);
        }
        else {
          this.serverErrorMsgs = personRes.messages;
        }
      });
    }
  }

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
        name: conference.name || null,
        role: conference.role || null
      });
    }
    this.toggleDisplayLinkConference();
  }

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
        name: panel.personName || null,
        title: panel.personTitle || null
      });
    }
    this.toggleDisplayLinkPanel();
  }

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
        name: presentation.personName || null
      });
    }
    this.toggleDisplayLinkPresentation();
  }

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
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayChairAffiliation();
  }

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
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayPresenterAffiliation();
  }

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
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayParticipantAffiliation();
  }

  removeConference(id: number) {
    this.conferencesToLink = this.conferencesToLink.filter(obj => {
      return obj.id != id;
    });
  }

  removePanel(id: number) {
    this.panelsToLink = this.panelsToLink.filter(obj => {
      return obj.id != id;
    });
  }

  removePresentation(id: number) {
    this.presentationsToLink = this.presentationsToLink.filter(obj => {
      return obj.id != id;
    });
  }

  removeChairAffiliation(panelId: number, institutionId: number) {
    this.chairAffiliationsToLink = this.chairAffiliationsToLink.filter(obj => {
      return obj.panelId != panelId || obj.institutionId != institutionId;
    });
  }

  removePresentationAffiliation(presentationId: number, institutionId: number) {
    this.presenterAffiliationsToLink = this.presenterAffiliationsToLink.filter(obj => {
      return obj.presentationId != presentationId || obj.institutionId != institutionId;
    });
  }

  removeParticipantAffiliation(conferenceId: number, institutionId: number) {
    this.participantAffiliationsToLink = this.participantAffiliationsToLink.filter(obj => {
      return obj.conferenceId != conferenceId || obj.institutionId != institutionId;
    });
  }

  toggleDisplayLinkConference() {
    this.displayLinkConference = !this.displayLinkConference;
    if (this.displayLinkConference) {
      this.displayLinkPresentation = false;
      this.displayLinkChairAffiliation = false;
      this.displayLinkPresenterAffiliation = false;
      this.displayLinkParticipantAffiliation = false;
    }
  }

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

  getConferenceTitleById(conferenceId: number){
    for (let conference of this.acceptableConferences) {
      if (conferenceId == conference.id) {
        return conference.title;
      }
    }
    return null;
  }

  getPanelTitleById(panelId: number){
    for (let panel of this.acceptablePanels) {
      if (panelId == panel.id) {
        return panel.title;
      }
    }
    return null;
  }

  getPresentationTitleById(presentationId: number){
    for (let presentation of this.acceptablePresentations) {
      if (presentationId == presentation.id) {
        return presentation.title;
      }
    }
    return null;
  }

  getInstitutionTitleById(institutionId: number){
    for (let institution of this.acceptableInstitutions) {
      if (institutionId == institution.id) {
        return institution.title;
      }
    }
    return null;
  }

  // filters list of acceptable conferences to only those that have been linked
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

  // filters list of acceptable panels to only those that have been linked
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

  // filters list of acceptable presentations to only those that have been linked
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
