import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';
import { Discipline } from './../../../interfaces/discipline.interface';
import { Location } from './../../../interfaces/location.interface';
import { Person } from './../../../interfaces/person.interface';
import { Institution } from './../../../interfaces/institution.interface';

// info for linking institutions to conference
interface InstitutionToLink {
  id: number;
  title: string;
  host: boolean;
  sponsor: boolean;
  society: boolean;
}

// info for linking people to conference as a participant
interface ParticipantToLink {
  personId: number;
  name: string | null;
  role: string | null;
}

// info for linking affiliation info about a person linked as participant
interface ParticipantAffiliationToLink {
  personId: number;
  institutionId: number;
  department: string | null;
}

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html',
  styleUrls: ['./add-conference.component.scss'],
})
export class AddConferenceComponent implements OnInit {
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
  displayLinkInstitution: boolean = false;
  displayAddInstitution: boolean = false;
  displayAddLocation: boolean = false;
  displayTagDiscipline: boolean = false;
  displayLinkParticipant: boolean = false;
  displayLinkParticipantAffiliation: boolean = false;
  // currently selected items
  selectedDiscipline: any;
  selectedLocation: any = null;
  // stores affiliated institutions and discplines
  selectedInstitutionIds: number[] = [];
  selectedDisciplineIds: number[] = [];
  // seperate from conference affiliation, this stores participant affiliation
  selectedInstitution: any;
  selectedPerson: any;
  // for storing items to link, to be added upon submission
  disciplinesToTag: Discipline[] = [];
  institutionsToLink: InstitutionToLink[] = [];
  participantsToLink: ParticipantToLink[] = [];
  participantAffiliationsToLink: ParticipantAffiliationToLink[] = [];
  // for storing list of possible items to select from
  acceptableInstitutions: Institution[] = [];
  acceptablePeople: Person[] = [];
  // for the optional department info of an affiliated participant
  participantAffiliationDepartment: any;
  // used for the date range picker
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  // allow no date in the future
  maxDate = new Date();

  constructor(
    private _api: ApiService,
    private _user: UserService
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
    this._api.getTypeRequest('people/').subscribe((peopleRes: any) => {
      this.acceptablePeople = peopleRes.sort(function(a:any, b:any) {
        // sort list of people alphabetically by name
        var textA = null;
        var textB = null;
        if (a.title) {
          textA = a.name.toUpperCase();
        }
        if (b.title) {
          textB = b.name.toUpperCase();
        }
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.selectedPerson = this.acceptablePeople[0] ? this.acceptablePeople[0].id : null;
      this._api.getTypeRequest('institutions/').subscribe((institutionRes: any) => {
        this.acceptableInstitutions = institutionRes.sort(function(a:any, b:any) {
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
    if (this.selectedLocation == null) {
      this.errorMsgs.push('Location cannot be blank');
      isValid = false;
    }
    if (reqObject.year < 1800) {
      this.errorMsgs.push('Year cannot be before 1800');
      isValid = false;
    }
    if (reqObject.year > new Date().getFullYear() ) {
      this.errorMsgs.push('Year cannot be later than the current year');
      isValid = false;
    }
    if (reqObject.startMonth < 1) {
      this.errorMsgs.push('Starting month cannot be less than 1');
      isValid = false;
    }
    if (reqObject.startMonth > 12) {
      this.errorMsgs.push('Starting month cannot be greater than 1');
      isValid = false;
    }
    if (reqObject.startDay < 1) {
      this.errorMsgs.push('Starting day cannot be less than 1');
      isValid = false;
    }
    if (reqObject.startDay > 31) {
      this.errorMsgs.push('Starting day cannot be greater than 31');
      isValid = false;
    }
    if (reqObject.endMonth < 1) {
      this.errorMsgs.push('Ending month cannot be less than 1');
      isValid = false;
    }
    if (reqObject.endMonth > 12) {
      this.errorMsgs.push('Ending month cannot be greater than 1');
      isValid = false;
    }
    if (reqObject.endDay < 1) {
      this.errorMsgs.push('Ending day cannot be less than 1');
      isValid = false;
    }
    if (reqObject.endDay > 31) {
      this.errorMsgs.push('Ending day cannot be greater than 31');
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
    var dateSelected:boolean = false;
    var reqObject = {
      title: '',
      locationId: null,
      year: null,
      startDay: null,
      startMonth: null,
      endDay: null,
      endMonth: null
    };
    if (this.selectedLocation) {
      reqObject.locationId = this.selectedLocation.id;
    }
    // copy values from form into request object
    Object.assign(reqObject, form.value);
    // copy start dates to end dates if not provided
    if (reqObject.endMonth == '') {
      reqObject.endMonth = reqObject.startMonth;
    }
    if (reqObject.endDay == '') {
      reqObject.endDay = reqObject.startDay;
    }
    reqObject = this.trimReqObject(reqObject);
    // copy values from the data picker object
    if (this.dateRange.value.start && this.dateRange.value.end) {
      dateSelected = true;
      reqObject.year = this.dateRange.value.start.getFullYear();
      reqObject.startDay = this.dateRange.value.start.getDate();
      reqObject.startMonth = this.dateRange.value.start.getMonth() + 1;
      reqObject.endDay = this.dateRange.value.end.getDate();
      reqObject.endMonth = this.dateRange.value.end.getMonth() + 1;
    }
    // ensure date was selected and object is valid before proceeding
    if (dateSelected) {
      if (this._validate(reqObject)) {
        this._api.postTypeRequest('conferences', reqObject).subscribe((conferenceRes: any) => {
          // link institutions
          for (let institutionToLink of this.institutionsToLink) {
            const institutionLinkReqObject = {
              conferenceId: conferenceRes.id,
              institutionId: institutionToLink.id,
              host: institutionToLink.host,
              sponsor: institutionToLink.sponsor,
              society: institutionToLink.society
            };
            this._api.postTypeRequest('conference-institutions', institutionLinkReqObject).subscribe();
          }
          // link disciplines
          for (let disciplineToTag of this.disciplinesToTag) {
            const disciplineTagReqObject = {
              conferenceId: conferenceRes.id,
              disciplineId: disciplineToTag.id
            };
            this._api.postTypeRequest('conference-disciplines', disciplineTagReqObject).subscribe();
          }
          // link participants
          for (let participantToLink of this.participantsToLink) {
            const participantLinkReqObject = {
              conferenceId: conferenceRes.id,
              personId: participantToLink.personId,
              name: participantToLink.name,
              role: participantToLink.role
            };
            this._api.postTypeRequest('people-participating', participantLinkReqObject).subscribe();
          }
          // link participant affiliations
          for (let participantAffiliationToLink of this.participantAffiliationsToLink) {
            const pariticpantAffiliationLinkReqObject = {
              conferenceId: conferenceRes.id,
              personId: participantAffiliationToLink.personId,
              institutionId: participantAffiliationToLink.institutionId,
              department: participantAffiliationToLink.department
            };
            this._api.postTypeRequest('participant-affiliations', pariticpantAffiliationLinkReqObject).subscribe();
          }
          if (conferenceRes.status !== 0) {
            alert('Conference successfully added!');
            this.successfullyAdded.emit(conferenceRes);
          }
          else {
            this.serverErrorMsgs = conferenceRes.messages;
          }
        });
      }
    }
  }

  /**
   * Gets participant info from html fields, ensures it has not already
   * been added, then adds it to the list of participants that will be linked
   * upon submission.
   * 
   * @param participant - Object with participant data
   */
  linkParticipant(participant: any) {
    // ensure no duplication
    let isDuplicate = false;
    for (let participantToLink of this.participantsToLink) {
      if (participantToLink.personId == participant.id) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.participantsToLink.push({
        personId: participant.id,
        name: participant.name || null,
        role: participant.role || null
      });
    }
    // hide linking UI
    this.toggleDisplayLinkParticipant();
  }

  /**
   * Gets affiliation info of a participant from html fields, ensures it has not already
   * been added, then adds it to a list of affiliation of participants that will be
   * linked upon submission. Similar to above function, but receives data as series
   * of parameters rather than in a single object.
   * 
   * @param personId - ID of the participant
   * @param institutionId - ID of the institutution to affiliate
   * @param affiliationDepartment - String of the department of the participant (can be blank string)
   */
  linkParticipantAffiliation(personId: number, institutionId: number, affiliationDepartment: string) {
    // ensure no duplication
    let isDuplicate = false;
    for (let participantAffiliationToLink of this.participantAffiliationsToLink) {
      if (participantAffiliationToLink.personId == personId && participantAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    // push new object
    if (!isDuplicate) {
      this.participantAffiliationsToLink.push({
        personId: personId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    // hide linking UI
    this.toggleDisplayParticipantAffiliation();
  }

  /**
   * Removes an institution that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * 
   * @param id - ID of the item
   */
  removeInstitution(id: number) {
    // remove the item
    this.institutionsToLink = this.institutionsToLink.filter(obj => {
      return obj.id != id;
    });
    // remove it from selection
    this.selectedInstitutionIds = this.selectedInstitutionIds.filter(element => {
      return element != id;
    });
  }

  /**
   * Removes an disicpline that was set to be linked. If item was added
   * by a selection widget, this removes it.
   * 
   * @param id - ID of the item
   */
  removeDiscipline(id: number) {
    // remove the item
    this.disciplinesToTag = this.disciplinesToTag.filter(obj => {
      return obj.id != id;
    });
    // remove it from selection
    this.selectedDisciplineIds = this.selectedDisciplineIds.filter(element => {
      return element != id;
    });
  }

  /**
   * Removes an participant that was set to be linked. If item was added by the
   * above linking method, this removes it.
   * 
   * @param id - ID of the item
   */
  removeParticipant(id: number) {
    // remove the item
    this.participantsToLink = this.participantsToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  /**
   * Removes an participant affiliation that was set to be linked. If item was added
   * by the above linking method, this removes it.
   * 
   * @param id - ID of the item
   */
  removeParticipantAffiliation(personId: number, institutionId: number) {
    this.participantAffiliationsToLink = this.participantAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  /**
   * Toggles display of UI to link existing institutions
   */
  toggleDisplayLinkInstitution() {
    this.displayLinkInstitution = !this.displayLinkInstitution;
  }

  /**
   * Toggles display of UI to add a new institution
   */
  toggleDisplayAddInstitution() {
    this.displayAddInstitution = !this.displayAddInstitution;
  }

  /**
   * Toggles display of UI to link existing disciplines
   */
  toggleDisplayTagDiscipline() {
    this.displayTagDiscipline = !this.displayTagDiscipline;
  }

  /**
   * Toggles display of UI to add a new location
   */
  toggleDisplayAddLocation() {
    this.displayAddLocation = !this.displayAddLocation;
  }

  /**
   * Toggles display of UI to link existing participants
   */
  toggleDisplayLinkParticipant() {
    this.displayLinkParticipant = !this.displayLinkParticipant;
    if (this.displayLinkParticipant) {
      this.displayLinkParticipantAffiliation = false;
    }
  }

  /**
   * Toggles display of UI to link existing participant affiliations
   */
  toggleDisplayParticipantAffiliation() {
    this.displayLinkParticipantAffiliation = !this.displayLinkParticipantAffiliation;
    if (this.displayLinkParticipantAffiliation) {
      this.displayLinkParticipant = false;
    }
  }

  /**
   * Helper method to provide means of getting a participant's name by their ID number.
   * Used by portions of the template where the item's ID is exposed by not its name.
   * 
   * @param participantId - ID of the participant
   * @returns String of the name of the participant, null if not found
   */
  getParticipantNameById(participantId: number){
    for (let participant of this.acceptablePeople) {
      if (participantId == participant.id) {
        return participant.name;
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
   * Executed upon event emission from the select institution widget.
   * Gets the selected institution's data and adds it to the list of
   * institutions to be linked upon creation.
   * 
   * @param selectedInstitution - Object with institution and role data
   */
  institutionSelected(selectedInstitution: any) {
    this.institutionsToLink.push({
      id: selectedInstitution.id,
      title: selectedInstitution.title,
      host: selectedInstitution.roles.host,
      sponsor: selectedInstitution.roles.sponsor,
      society: selectedInstitution.roles.society
    });
    this.selectedInstitutionIds.push(selectedInstitution.id);
    // remove any duplicate disciplines
    this.institutionsToLink = [...new Set(this.institutionsToLink)];
    this.displayLinkInstitution = false;
  }

  /**
   * Executed upon event emission from the select discipline widget.
   * Gets the selected disciplines's data and adds it to the list of
   * institutions to be linked upon creation.
   * 
   * @param selectedDiscipline - Object with discipline
   */
  disciplineSelected(selectedDiscipline: any) {
    this.disciplinesToTag.push({
      id: selectedDiscipline.id,
      title: selectedDiscipline.title
    });
    this.selectedDisciplineIds.push(selectedDiscipline.id);
    // remove any duplicate disciplines
    this.disciplinesToTag = [...new Set(this.disciplinesToTag)];
    this.displayTagDiscipline = false;
  }

  /**
   * Executed upon event emission from the select location widget.
   * Gets the select location's data stores it.
   * 
   * @param selectedLocation - Object with data on the selected location
   */
  locationSelected(selectedLocation: any) {
    this.selectedLocation = selectedLocation;
    this.displayAddLocation = false;
  }

  /**
   * Returns a list of data that only includes those who have already been
   * linked. Used by portions of the HTML template for associating institutions
   * with participants. This ensures that institutions can only be linked
   * with those already added to the participant list.
   * 
   * @returns Array of objects, each with a participant's data
   */
  filterParticipantsByLinked() {
    let idsToFilter = [];
    let filteredParticipants: any[] = [];
    for (let participantToLink of this.participantsToLink) {
      idsToFilter.push(participantToLink.personId);
    }
    for (let acceptablePerson of this.acceptablePeople) {
      if (idsToFilter.includes(acceptablePerson.id)) {
        filteredParticipants.push(acceptablePerson);
      }
    }
    return filteredParticipants;
  }

}
