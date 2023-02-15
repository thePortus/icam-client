import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discipline-detail-view',
  templateUrl: './discipline-detail-view.component.html',
  styleUrls: ['./discipline-detail-view.component.scss']
})
export class DisciplineDetailViewComponent implements OnInit {
  disciplineId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.disciplineId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
