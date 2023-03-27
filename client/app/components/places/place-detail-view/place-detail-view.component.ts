import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-place-detail-view',
  templateUrl: './place-detail-view.component.html',
  styleUrls: ['./place-detail-view.component.scss']
})
export class PlaceDetailViewComponent implements OnInit {
  // item id and loading flag
  placeId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.placeId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
