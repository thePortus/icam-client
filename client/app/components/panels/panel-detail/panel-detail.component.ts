import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-panel-detail',
  templateUrl: './panel-detail.component.html',
  styleUrls: ['./panel-detail.component.scss']
})
export class PanelDetailComponent implements OnInit {
  @Input() panelId = '';

  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  protectedData: any;
  flattenedData: any;
  totals = {
    'presentations': 0,
    'chairs': 0,
    'presenters': 0
  };
  toggleDisplay = {
    'presentations': false,
    'chairs': false,
    'presenters': false
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
    this._api.getTypeRequest('panels/' + this.panelId).subscribe((res: any) => {
      this.protectedData = res;
      this.getTotals();
      this.flattenData();
      this.loading = false;
    });
  }

  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      this._api.deleteTypeRequest('panels/' + this.panelId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/panels']);
      });
    }
  }

  getTotals() {
    this.totals = {
      'presentations': 0,
      'chairs': 0,
      'presenters': 0
    };
    for (let chair of this.protectedData.chairs) {
      this.totals.chairs +=1 ;
    }
    for (let presentation of this.protectedData.presentations) {
      this.totals.presentations += 1;
      for (let presenter of presentation.presenters) {
        this.totals.presenters += 1;
      }
    }
  }

  flattenData() {
    /* cyles through protectedData nested data and gets info on presentations,
    chairs, and presenters in flattened form */
    this.flattenedData = {
      presentations: [],
      chairs: [],
      presenters: []
    };
    // copy chairs, avoiding duplicates
    for (let chair of this.protectedData.chairs) {
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
    for (let presentation of this.protectedData.presentations) {
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
    return true;
  }

}
