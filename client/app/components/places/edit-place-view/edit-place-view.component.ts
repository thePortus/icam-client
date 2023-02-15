import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-place-view',
  templateUrl: './edit-place-view.component.html',
  styleUrls: ['./edit-place-view.component.scss']
})
export class EditPlaceViewComponent implements OnInit {
  placeId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.placeId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
