import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-institution-view',
  templateUrl: './add-institution-view.component.html',
  styleUrls: ['./add-institution-view.component.scss']
})
export class AddInstitutionViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  institutionAdded(institution: any) {
    this._router.navigate(['/institutions/' + institution.id.toString()]);
  }

}
