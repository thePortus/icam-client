import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-discipline-view',
  templateUrl: './edit-discipline-view.component.html',
  styleUrls: ['./edit-discipline-view.component.scss']
})
export class EditDisciplineViewComponent implements OnInit {
  disciplineId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.disciplineId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
