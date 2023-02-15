import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

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
  @Output() successfullyAdded = new EventEmitter<string>();

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  selectedPanel: any = null;
  displayLinkPresenter: boolean = false;
  displayLinkPresenterAffiliation: boolean = false;
  displayLinkPlace: boolean = false;
  displayLinkTopic: boolean = false;
  presentersToLink: any[] =[];
  presenterAffiliationsToLink: any[] = [];
  placesToLink: any[] = [];
  topicsToLink: any[] = [];
  selectedTopic: any;
  selectedPlace: any;
  selectedPerson: any;
  selectedInstitution: any;
  selectedPlaceIds: number[] = [];
  selectedTopicIds: number[] = [];
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
          alert('Presentation successfully added!');
          this.successfullyAdded.emit(res);
        }
        else {
          this.serverErrorMsgs = res.messages;
        }
      });
    }
  }

  panelSelected(selectedPanel: any) {
    this.selectedPanel = selectedPanel;
  }

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

  removePresenter(id: number) {
    this.presentersToLink = this.presentersToLink.filter(obj => {
      return obj.personId != id;
    });
  }

  removePresenterAffiliation(personId: number, institutionId: number) {
    this.presenterAffiliationsToLink = this.presenterAffiliationsToLink.filter(obj => {
      return obj.personId != personId || obj.institutionId != institutionId;
    });
  }

  removeTopic(id: number) {
    this.topicsToLink = this.topicsToLink.filter(obj => {
      return obj.id != id;
    });
    this.selectedTopicIds = this.selectedTopicIds.filter(element => {
      return element != id;
    });
  }

  removePlace(id: number) {
    this.placesToLink = this.placesToLink.filter(obj => {
      return obj.id != id;
    });
    this.selectedPlaceIds = this.selectedPlaceIds.filter(element => {
      return element != id;
    });
  }

  toggleDisplayLinkPresenter() {
    this.displayLinkPresenter = !this.displayLinkPresenter;
    if (this.displayLinkPresenter) {
      this.displayLinkPresenterAffiliation = false;
    }
  }

  toggleDisplayPresenterAffiliation() {
    this.displayLinkPresenterAffiliation = !this.displayLinkPresenterAffiliation;
    if (this.displayLinkPresenterAffiliation) {
      this.displayLinkPresenter = false;
    }
  }

  toggleDisplayLinkTopic() {
    this.displayLinkTopic = !this.displayLinkTopic;
  }

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

  getInstitutionTitleById(institutionId: number){
    for (let institution of this.acceptableInstitutions) {
      if (institutionId == institution.id) {
        return institution.title;
      }
    }
    return null;
  }

  // filters list of acceptable presenters to only those that have been linked
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

  linkedPresenterIds() {
    let idList: number[] = [];
    for (let presenterToLink of this.presentersToLink) {
      idList.push(presenterToLink.id);
    }
    return idList;
  }

}
