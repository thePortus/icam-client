import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ExportComponent } from './export.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from 'app/services/api.service';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        ApiService,
      ],
      imports: [ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const mockData: any = {
      body: {
        conferences: [],
        disciplines: [],
        institutions: [],
        locations: [],
        panels: [],
        people: [],
        presentations: [],
        topics: [],
        geographies: [],
        chairAffiliations: [],
        conferenceDisciplines: [],
        conferenceInstitutions: [],
        peopleChairing: [],
        peoplePresenting: [],
        peopleParticipating: [],
        presentationGeographies: [],
        presentationTopics: [],
        presenterAffiliations: [],
        participantAffiliations: []
      }
    };
    const apiService = TestBed.inject(ApiService)
    spyOn(apiService, 'getTypeRequest').and.returnValue(of(mockData));
    component.ngOnInit();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.single-col')?.textContent).toContain('Download conferences.json');
  });

});
