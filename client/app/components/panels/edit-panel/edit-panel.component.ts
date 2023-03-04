import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Institution } from './../../../interfaces/institution.interface';
import { Person } from './../../../interfaces/person.interface';

interface ChairToLink {
  panelId: number;
  personId: number;
  name: string;
  title: string;
}

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
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() panelId = '';

  loading: boolean = true;
  loadingError: boolean = false;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  protectedData: any;
  selectedConference: any = null;
  selectedType = 'General';
  acceptableTypes = [
    'General', 'Presidental Address', 'Keynote', 'Plenary', 'Workshop', 'Roundtable',
    'Uncertain', 'Other'
  ];
  displayLinkChair: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  chairsToLink: ChairToLink[] = [];
  chairAffiliationsToLink: ChairAffiliationToLink[] = [];
  selectedPerson: any;
  selectedInstitution: any;
  acceptablePeople: Person[] = [];
  acceptableInstitutions: Institution[] = [];
  affiliationDepartment: string = '';

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _router: Router
  ) { }

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

  // cycles through each property in the req object and if it is a string, trim and leading or trailing whitespaces
  trimReqObject(objectToTrim: any) {
    Object.keys(objectToTrim).forEach(property => {
      if (typeof objectToTrim[property] == 'string') {
        objectToTrim[property] = objectToTrim[property].trim();
      }
    });
    return objectToTrim;
  }

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
          alert('Item successfully updated!');
          // navigate to disciplines
          this._router.navigate(['/panels/' + this.protectedData.id]);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  conferenceSelected(selectedConference: any) {
    this.selectedConference = selectedConference;
  }

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

  removeChair(id: number) {
    this.chairsToLink = this.chairsToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  removeChairAffiliation(personId: number, institutionId: number) {
    this.chairAffiliationsToLink = this.chairAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  toggleDisplayLinkChair() {
    this.displayLinkChair = !this.displayLinkChair;
    if (this.displayLinkChair) {
      this.displayLinkChairAffiliation = false;
    }
  }

  toggleDisplayChairAffiliation() {
    this.displayLinkChairAffiliation = !this.displayLinkChairAffiliation;
    if (this.displayLinkChairAffiliation) {
      this.displayLinkChair = false;
    }
  }

  getChairNameById(personId: number){
    for (let person of this.acceptablePeople) {
      if (personId == person.id) {
        return person.name;
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

  // filters list of acceptable chairs to only those that have been linked
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

  linkedChairIds() {
    let idList: number[] = [];
    for (let chairToLink of this.chairsToLink) {
      idList.push(chairToLink.personId);
    }
    return idList;
  }

}
