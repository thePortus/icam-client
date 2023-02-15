import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from './../../services/api.service';

interface jsonHrefs {
  conferences: any;
  disciplines: any;
  institutions: any;
  locations: any;
  panels: any;
  people: any;
  presentations: any;
  topics: any;
  geographies: any;
  chairAffiliations: any;
  conferenceDisciplines: any;
  conferenceInstitutions: any;
  peopleChairing: any;
  peoplePresenting: any;
  presentationGeographies: any;
  presentationTopics: any;
  presenterAffiliations: any;
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  loading: boolean = true;
  protectedData: any;
  downloadJsonHrefs: jsonHrefs = {
    conferences: [],
    disciplines: [],
    institutions: [],
    locations: [],
    panels: [],
    people: [],
    presentations: [],
    topics: [],
    geographies: [],
    chairAffiliations: [],
    conferenceDisciplines: [],
    conferenceInstitutions: [],
    peopleChairing: [],
    peoplePresenting: [],
    presentationGeographies: [],
    presentationTopics: [],
    presenterAffiliations: []
  };

  constructor(
    private _api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this._api.getTypeRequest('export/').subscribe((res: any) => {
      this.protectedData = res;
      this.generateDownloadJsonUri();
      this.loading = false;
    });
  }

  generateDownloadJsonUri() {
    var theJSON = null;
    var uri = null;

    theJSON = JSON.stringify(this.protectedData.conferences);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.conferences = uri;
    theJSON = JSON.stringify(this.protectedData.disciplines);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.disciplines = uri;
    theJSON = JSON.stringify(this.protectedData.institutions);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.institutions = uri;
    theJSON = JSON.stringify(this.protectedData.locations);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.locations = uri;
    theJSON = JSON.stringify(this.protectedData.panels);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.panels = uri;
    theJSON = JSON.stringify(this.protectedData.people);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.people = uri;
    theJSON = JSON.stringify(this.protectedData.presentations);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.presentations = uri;
    theJSON = JSON.stringify(this.protectedData.topics);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.topics = uri;
    theJSON = JSON.stringify(this.protectedData.geographies);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.geographies = uri;
    theJSON = JSON.stringify(this.protectedData.chairAffiliations);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.chairAffiliations = uri;
    theJSON = JSON.stringify(this.protectedData.conferenceDisciplines);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.conferenceDisciplines = uri;
    theJSON = JSON.stringify(this.protectedData.conferenceInstitutions);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.conferenceInstitutions = uri;
    theJSON = JSON.stringify(this.protectedData.peopleChairing);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.peopleChairing = uri;
    theJSON = JSON.stringify(this.protectedData.peoplePresenting);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.peoplePresenting = uri;
    theJSON = JSON.stringify(this.protectedData.presentationGeographies);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.presentationGeographies = uri;
    theJSON = JSON.stringify(this.protectedData.presentationTopics);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.presentationTopics = uri;
    theJSON = JSON.stringify(this.protectedData.presenterAffiliations);
    uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHrefs.presenterAffiliations = uri;
  }

}
