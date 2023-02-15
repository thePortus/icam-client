import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-place-view',
  templateUrl: './add-place-view.component.html',
  styleUrls: ['./add-place-view.component.scss']
})
export class AddPlaceViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  placeAdded(place: any) {
    this._router.navigate(['/places/' + place.id.toString()]);
  }

}
