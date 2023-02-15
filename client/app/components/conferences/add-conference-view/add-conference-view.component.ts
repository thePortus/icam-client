import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-conference-view',
  templateUrl: './add-conference-view.component.html',
  styleUrls: ['./add-conference-view.component.scss']
})
export class AddConferenceViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  conferenceAdded(conference: any) {
    this._router.navigate(['/conferences/' + conference.id.toString()]);
  }

}
