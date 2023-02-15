import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-detail-view',
  templateUrl: './place-detail-view.component.html',
  styleUrls: ['./place-detail-view.component.scss']
})
export class PlaceDetailViewComponent implements OnInit {
  placeId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.placeId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
