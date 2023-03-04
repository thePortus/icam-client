import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

import { Institution } from './../../../interfaces/institution.interface';
import { Person } from './../../../interfaces/person.interface';

interface PresenterToLink {
  panelId: number;
  personId: number;
}

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
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() presentationId = '';

  loading: boolean = true;
  loadingError: boolean = false;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  userDetails$: Observable<User>;
  user: any;
  protectedData: any;
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
    private _user: UserService,
    private _router: Router
  ) { }

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
          personId: presenter.id
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

  private _validate(reqObject: any): boolean {
    var isValid = true;
    this.errorMsgs = [];
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
            this._api.deleteTypeRequest('people-presenting/' + presenterToRemove.PersonPresenting.presentationId.toString() + '/' + presenterToRemove.id.toString()).subscribe(() => {

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
              name: presenterToLink.name
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
          alert('Item successfully updated!');
          // navigate to disciplines
          this._router.navigate(['/presentations/' + this.protectedData.id]);
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
