import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

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
  @Output() successfullyAdded = new EventEmitter<string>();

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  selectedConference: any = null;
  selectedType = 'General';
  acceptableTypes = [
    'General', 'Presidental Address', 'Keynote', 'Plenary', 'Workshop', 'Roundtable',
    'Uncertain', 'Other'
  ];
  displayLinkChair: boolean = false;
  displayLinkChairAffiliation: boolean = false;
  chairsToLink: any[] =[];
  chairAffiliationsToLink: any[] = [];
  selectedPerson: any;
  selectedInstitution: any;
  acceptablePeople: Person[] = [];
  acceptableInstitutions: Institution[] = [];
  affiliationDepartment: string = '';

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
          alert('Panel successfully added!');
          this.successfullyAdded.emit(res);
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
      idList.push(chairToLink.id);
    }
    return idList;
  }

}
