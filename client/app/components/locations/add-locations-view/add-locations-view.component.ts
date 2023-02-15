import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-locations-view',
  templateUrl: './add-locations-view.component.html',
  styleUrls: ['./add-locations-view.component.scss']
})
export class AddLocationsViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  locationAdded(location: any) {
    this._router.navigate(['/locations/' + location.id.toString()]);
  }

}
