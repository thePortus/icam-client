import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-presentation-detail',
  templateUrl: './presentation-detail.component.html',
  styleUrls: ['./presentation-detail.component.scss']
})
export class PresentationDetailComponent implements OnInit {
  // id of item to view
  @Input() presentationId = '';

  // observable and local object for user data
  userDetails$: Observable<User>;
  user: any;
  // loading flag & error messages
  loading: boolean = true;
  loadingError: boolean = false;
  // storage for current item data from server
  protectedData: any;
  // toggle flags for displaying ui for linking items
  toggleDisplay = {
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
   * Fetch item data from server, and set .loading flag to false.
   */
  update() {
    this._api.getTypeRequest('presentations/' + this.presentationId).subscribe((res: any) => {
      this.protectedData = res;
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
      this._api.deleteTypeRequest('presentations/' + this.presentationId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/presentations']);
      });
    }
  }

}
