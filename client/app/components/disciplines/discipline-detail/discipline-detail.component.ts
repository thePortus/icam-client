import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './../../../services/api.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-discipline-detail',
  templateUrl: './discipline-detail.component.html',
  styleUrls: ['./discipline-detail.component.scss']
})
export class DisciplineDetailComponent implements OnInit {
  @Input() disciplineId = '';
  userDetails$: Observable<User>;
  user: any;
  loading: boolean = true;
  loadingError: boolean = false;
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
    this._api.getTypeRequest('disciplines/' + this.disciplineId).subscribe((res: any) => {
      this.protectedData = res;
      this.loading = false;
    }, (error: any) => {
      this.loadingError = true;
    });
  }

  deleteItem() {
    if (confirm('Are you sure you delete this item? WARNING: CANNOT BE UNDONE!')) {
      for (let conference of this.protectedData.conferences) {
        this._api.deleteTypeRequest('conference-disciplines/' + conference.id + '/' + this.disciplineId).subscribe();
      }
      this._api.deleteTypeRequest('disciplines/' + this.disciplineId).subscribe((res:any) => {
        alert('Item successfully deleted!');
        this._router.navigate(['/disciplines']);
      });
    }
    return true;
  }

}
