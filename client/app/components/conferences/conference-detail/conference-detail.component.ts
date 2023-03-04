import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-conference-detail',
  templateUrl: './conference-detail.component.html',
  styleUrls: ['./conference-detail.component.scss']
})
export class ConferenceDetailComponent implements OnInit {
  @Input() conferenceId = '';

  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  loadingError: boolean = false;
  protectedData: any;
  flattenedData: any;
  totals = {
    'panels': 0,
    'presentations': 0,
    'chairs': 0,
    'presenters': 0
  };
  toggleDisplay = {
    'panels': false,
    'presentations': false,
    'chairs': false,
    'presenters': false,
    'institutions': false,
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
    this._api.getTypeRequest('conferences/' + this.conferenceId).subscribe((res: any) => {
      this.protectedData = res;
      this.getTotals();
      this.flattenData();
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  getTotals() {
    this.totals = {
      'panels': 0,
      'presentations': 0,
      'chairs': 0,
      'presenters': 0,
    };
    for(let panel of this.protectedData.panels) {
      this.totals.panels += 1;
      for (let chair of panel.chairs) {
        this.totals.chairs +=1 ;
      }
      for (let presentation of panel.presentations) {
        this.totals.presentations += 1;
        for (let presenter of presentation.presenters) {
          this.totals.presenters += 1;
        }
      }
    }
  }

  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      for (let discipline of this.protectedData.disciplines) {
        this._api.deleteTypeRequest('conference-disciplines/' + this.conferenceId + '/' + discipline.id).subscribe();
      }
      for (let institution of this.protectedData.institutions) {
        this._api.deleteTypeRequest('conference-institutions/' + this.conferenceId + '/' + institution.id).subscribe();
      }
      this._api.deleteTypeRequest('conferences/' + this.conferenceId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/conferences']);
      });
    }
    return true;
  }

  flattenData() {
    /* cyles through protectedData nested data and gets info on presentations,
    chairs, and presenters in flattened form */
    this.flattenedData = {
      presentations: [],
      chairs: [],
      presenters: []
    };
    for (let panel of this.protectedData.panels) {
      // copy chairs, avoiding duplicates
      for (let chair of panel.chairs) {
        let chairFound = false;
        for (let previousChair of this.flattenedData.chairs) {
          if (chair.id === previousChair.id) {
            chairFound = true;
          }
        }
        if (!chairFound) {
          this.flattenedData.chairs.push(chair);
        }
      }
      // copy presentations
      for (let presentation of panel.presentations) {
        this.flattenedData.presentations.push(presentation);
        // copy presenters, avoiding duplicates
        for (let presenter of presentation.presenters) {
          let presenterFound = false;
          for (let previousPresenter of this.flattenedData.presenters) {
            if (presenter.id === previousPresenter.id) {
              presenterFound = true;
            }
          }
          if (!presenterFound) {
            this.flattenedData.presenters.push(presenter);
          }
        }
      }
    }
    return true;
  }

}
