import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';
import { Discipline } from './../../../interfaces/discipline.interface';
import { Location } from './../../../interfaces/location.interface';
import { Person } from './../../../interfaces/person.interface';
import { Institution } from './../../../interfaces/institution.interface';

interface InstitutionToLink {
  id: number;
  title: string;
  host: boolean;
  sponsor: boolean;
  society: boolean;
}

interface ParticipantToLink {
  personId: number;
  name: string | null;
  role: string | null;
}

interface ParticipantAffiliationToLink {
  personId: number;
  institutionId: number;
  department: string | null;
}

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html',
  styleUrls: ['./add-conference.component.scss']
})
export class AddConferenceComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  displayLinkInstitution: boolean = false;
  displayAddInstitution: boolean = false;
  displayAddLocation: boolean = false;
  displayTagDiscipline: boolean = false;
  displayLinkParticipant: boolean = false;
  displayLinkParticipantAffiliation: boolean = false;
  selectedDiscipline: any;
  selectedLocation: any = null;
  // stores affiliated institutions and discplines
  selectedInstitutionIds: number[] = [];
  selectedDisciplineIds: number[] = [];
  // seperate from conference affiliation, this stores participant affiliation
  selectedInstitution: any;
  selectedPerson: any;
  disciplinesToTag: Discipline[] = [];
  institutionsToLink: InstitutionToLink[] = [];
  participantsToLink: ParticipantToLink[] = [];
  participantAffiliationsToLink: ParticipantAffiliationToLink[] = [];
  acceptableInstitutions: Institution[] = [];
  acceptablePeople: Person[] = [];
  participantAffiliationDepartment: any;

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
    if (this._validate(reqObject)) {
      this._api.postTypeRequest('conferences', reqObject).subscribe((conferenceRes: any) => {
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
        for (let disciplineToTag of this.disciplinesToTag) {
          const disciplineTagReqObject = {
            conferenceId: conferenceRes.id,
            disciplineId: disciplineToTag.id
          };
          this._api.postTypeRequest('conference-disciplines', disciplineTagReqObject).subscribe();
        }
        for (let participantToLink of this.participantsToLink) {
          const participantLinkReqObject = {
            conferenceId: conferenceRes.id,
            personId: participantToLink.personId,
            name: participantToLink.name,
            role: participantToLink.role
          };
          this._api.postTypeRequest('people-participating', participantLinkReqObject).subscribe();
        }
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

  linkParticipant(participant: any) {
    let isDuplicate = false;
    for (let participantToLink of this.participantsToLink) {
      if (participantToLink.personId == participant.id) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.participantsToLink.push({
        personId: participant.id,
        name: participant.name || null,
        role: participant.role || null
      });
    }
    this.toggleDisplayLinkParticipant();
  }

  linkParticipantAffiliation(personId: number, institutionId: number, affiliationDepartment: string) {
    let isDuplicate = false;
    for (let participantAffiliationToLink of this.participantAffiliationsToLink) {
      if (participantAffiliationToLink.personId == personId && participantAffiliationToLink.institutionId == institutionId) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      this.participantAffiliationsToLink.push({
        personId: personId,
        institutionId: institutionId,
        department: affiliationDepartment
      });
    }
    this.toggleDisplayParticipantAffiliation();
  }

  removeInstitution(id: number) {
    this.institutionsToLink = this.institutionsToLink.filter(obj => {
      return obj.id != id;
    });
    this.selectedInstitutionIds = this.selectedInstitutionIds.filter(element => {
      return element != id;
    });
  }

  removeDiscipline(id: number) {
    this.disciplinesToTag = this.disciplinesToTag.filter(obj => {
      return obj.id != id;
    });
    this.selectedDisciplineIds = this.selectedDisciplineIds.filter(element => {
      return element != id;
    });
  }

  removeParticipant(id: number) {
    this.participantsToLink = this.participantsToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  removeParticipantAffiliation(personId: number, institutionId: number) {
    this.participantAffiliationsToLink = this.participantAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  toggleDisplayLinkInstitution() {
    this.displayLinkInstitution = !this.displayLinkInstitution;
  }

  toggleDisplayAddInstitution() {
    this.displayAddInstitution = !this.displayAddInstitution;
  }

  toggleDisplayTagDiscipline() {
    this.displayTagDiscipline = !this.displayTagDiscipline;
  }

  toggleDisplayAddLocation() {
    this.displayAddLocation = !this.displayAddLocation;
  }

  toggleDisplayLinkParticipant() {
    this.displayLinkParticipant = !this.displayLinkParticipant;
    if (this.displayLinkParticipant) {
      this.displayLinkParticipantAffiliation = false;
    }
  }

  toggleDisplayParticipantAffiliation() {
    this.displayLinkParticipantAffiliation = !this.displayLinkParticipantAffiliation;
    if (this.displayLinkParticipantAffiliation) {
      this.displayLinkParticipant = false;
    }
  }

  getParticipantNameById(participantId: number){
    for (let participant of this.acceptablePeople) {
      if (participantId == participant.id) {
        return participant.name;
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

  locationSelected(selectedLocation: any) {
    this.selectedLocation = selectedLocation;
    this.displayAddLocation = false;
  }

  // filters list of acceptable people to only those that have been linked
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
