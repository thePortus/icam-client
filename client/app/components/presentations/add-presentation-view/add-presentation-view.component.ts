import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-presentation-view',
  templateUrl: './add-presentation-view.component.html',
  styleUrls: ['./add-presentation-view.component.scss']
})
export class AddPresentationViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  presentationAdded(presentation: any) {
    this._router.navigate(['/presentations/' + presentation.id.toString()]);
  }

}
