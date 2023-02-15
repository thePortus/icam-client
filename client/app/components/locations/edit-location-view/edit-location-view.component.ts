import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-location-view',
  templateUrl: './edit-location-view.component.html',
  styleUrls: ['./edit-location-view.component.scss']
})
export class EditLocationViewComponent implements OnInit {
  locationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.locationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
