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
  // id of item to view
  @Input() panelId = '';

  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  // storage for current item data from server
  protectedData: any;
  // for storing flattened form on related item info in this.protectedData on presentations, chairs, and presenters
  flattenedData: any;
  // for storing item counts
  totals = {
    'presentations': 0,
    'chairs': 0,
    'presenters': 0
  };
  // toggle flags for displaying ui for linking items
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

  /**
   * Gets user details, fetches data from server.
   */
  ngOnInit(): void {
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
    this.update();
  }

  /**
   * On component changes, re-fetch data from server.
   * 
   * @param changes - Data on nature of component changes (unnecessary)
   */
  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  /**
   * Fetch item data from server, perform calculation of item totals, flattening of data,
   * and set .loading flag to false.
   */
  update() {
    this._api.getTypeRequest('panels/' + this.panelId).subscribe((res: any) => {
      this.protectedData = res;
      this.getTotals();
      this.flattenData();
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  /**
   * Asks to confirm via alert. Then unlinks all linked items and finally
   * deletes the item itself. Navigates back to list of items.
   * 
   * @returns true
   */
  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      this._api.deleteTypeRequest('panels/' + this.panelId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/panels']);
      });
    }
  }

  /**
   * iterates over related items (presentations, presenters, chairs),
   * tallies them, and stores them in this.totals.
   */
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

  /**
   * Cyles through protectedData nested data and gets info on presentations,
   * chairs, and presenters in flattened form. Stores in this.flattenedData.
   * 
   * @returns true
   */
  flattenData() {
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
