import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-discipline-view',
  templateUrl: './add-discipline-view.component.html',
  styleUrls: ['./add-discipline-view.component.scss']
})
export class AddDisciplineViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  disciplineAdded(discipline: any) {
    this._router.navigate(['/disciplines/' + discipline.id.toString()]);
  }

}
