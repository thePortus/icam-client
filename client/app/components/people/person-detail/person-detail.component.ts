import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit {
  @Input() personId = '';
  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  loadingError: boolean = false;
  protectedData: any;
  toggleDisplay = {
    'panels': false,
    'presentations': false,
    'institutions': false
  };

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  update() {
    this._api.getTypeRequest('people/' + this.personId).subscribe((res: any) => {
      this.protectedData = res;
      this.protectedData.institutions = this.getInstitutionsAndDepartments();
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      this._api.deleteTypeRequest('people/' + this.personId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/people']);
      });
    }
    return true;
  }

  // returns an array objects, with institution id as keys, at each value is a { institution: {}, departments: [] } object
  getInstitutionsAndDepartments() {
    // object to store institution info by institution id as key... will be converted into an array for return
    let institutionsAndDepartments: any = {};
    // return array, to contain convered object from above
    let returnArray: Array<any> = [];
    for (let chairInstitution of this.protectedData.affiliationsAsChair) {
      // if institution has been encountered before
      if (chairInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(chairInstitution.chairAffiliationLink.department in institutionsAndDepartments[chairInstitution.id].departments)) {
          institutionsAndDepartments[chairInstitution.id].departments.push(chairInstitution.chairAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (chairInstitution.chairAffiliationLink.department != '') {
        institutionsAndDepartments[chairInstitution.id] = {
          institution: chairInstitution,
          departments: [chairInstitution.chairAffiliationLink.department]
        };
      }
    }
    for (let presenterInstitution of this.protectedData.affiliationsAsPresenter) {
      // if institution has been encountered before
      if (presenterInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(presenterInstitution.presenterAffiliationLink.department in institutionsAndDepartments[presenterInstitution.id].departments)) {
          institutionsAndDepartments[presenterInstitution.id].departments.push(presenterInstitution.presenterAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (presenterInstitution.presenterAffiliationLink.department != '') {
        institutionsAndDepartments[presenterInstitution.id] = {
          institution: presenterInstitution,
          departments: [presenterInstitution.presenterAffiliationLink.department]
        };
      }
    }
    for (let participantInstitution of this.protectedData.affiliationsAsParticipant) {
      // if institution has been encountered before
      if (participantInstitution.id in institutionsAndDepartments) {
        // only add department if it is not already added
        if (!(participantInstitution.participantAffiliationLink.department in institutionsAndDepartments[participantInstitution.id].departments)) {
          institutionsAndDepartments[participantInstitution.id].departments.push(participantInstitution.participantAffiliationLink.department);
        }
      }
      // if institution has not been encountered before
      else if (participantInstitution.participantAffiliationLink.department != '') {
        institutionsAndDepartments[participantInstitution.id] = {
          institution: participantInstitution,
          departments: [participantInstitution.participantAffiliationLink.department]
        };
      }
    }
    // now convert each spot in object to an item in the array
    for (let institution in institutionsAndDepartments) {
      returnArray.push(institutionsAndDepartments[institution]);
    }
    return returnArray;
  }

}
