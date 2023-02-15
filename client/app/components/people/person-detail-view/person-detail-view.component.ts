import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person-detail-view',
  templateUrl: './person-detail-view.component.html',
  styleUrls: ['./person-detail-view.component.scss']
})
export class PersonDetailViewComponent implements OnInit {
  personId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.personId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
