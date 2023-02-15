import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-institution-view',
  templateUrl: './edit-institution-view.component.html',
  styleUrls: ['./edit-institution-view.component.scss']
})
export class EditInstitutionViewComponent implements OnInit {
  institutionId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.institutionId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
