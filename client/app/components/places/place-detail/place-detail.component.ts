import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {
  @Input() placeId = '';
  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  protectedData: any;

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
    this._api.getTypeRequest('geographies/' + this.placeId).subscribe((res: any) => {
      this.protectedData = res;
      this.loading = false;
    });
  }

  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      this._api.deleteTypeRequest('geographies/' + this.placeId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/places']);
      });
    }
    return true;
  }

}
