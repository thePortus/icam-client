import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-person-view',
  templateUrl: './edit-person-view.component.html',
  styleUrls: ['./edit-person-view.component.scss']
})
export class EditPersonViewComponent implements OnInit {
  personId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.personId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
