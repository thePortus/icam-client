import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-institution-detail-view',
  templateUrl: './institution-detail-view.component.html',
  styleUrls: ['./institution-detail-view.component.scss']
})
export class InstitutionDetailViewComponent implements OnInit {
  institutionId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.institutionId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
