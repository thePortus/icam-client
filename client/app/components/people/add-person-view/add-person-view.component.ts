import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-person-view',
  templateUrl: './add-person-view.component.html',
  styleUrls: ['./add-person-view.component.scss']
})
export class AddPersonViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  personAdded(person: any) {
    this._router.navigate(['/people/' + person.id.toString()]);
  }

}
