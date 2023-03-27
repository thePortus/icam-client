import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-person-detail-view',
  templateUrl: './person-detail-view.component.html',
  styleUrls: ['./person-detail-view.component.scss']
})
export class PersonDetailViewComponent implements OnInit {
  // item id and loading flag
  personId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.personId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
