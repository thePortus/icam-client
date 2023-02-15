import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location-detail-view',
  templateUrl: './location-detail-view.component.html',
  styleUrls: ['./location-detail-view.component.scss']
})
export class LocationDetailViewComponent implements OnInit {
  locationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.locationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
