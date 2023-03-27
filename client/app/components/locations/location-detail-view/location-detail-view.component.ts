import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-location-detail-view',
  templateUrl: './location-detail-view.component.html',
  styleUrls: ['./location-detail-view.component.scss']
})
export class LocationDetailViewComponent implements OnInit {
  // item id & loading flag
  locationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.locationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
