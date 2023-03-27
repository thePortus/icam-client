// external imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// service imports
import { InterceptorService } from './services/interceptor.service';

// pipe imports
import { FilterPipe } from './pipes/filter.pipe';

// component imports
import { HeaderComponent } from './components/common/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { HomeIntroComponent } from './components/home/home-intro/home-intro.component';
import { HomeCreditsComponent } from './components/home/home-credits/home-credits.component';
import { HomeSpecsComponent } from './components/home/home-specs/home-specs.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PrivacyPolicyComponent } from './components/common/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfirmRoleChangeDialog } from './components/profile/users/users.component';
import { UsersComponent } from './components/profile/users/users.component';
import { AddLocationComponent } from './components/locations/add-location/add-location.component';
import { AddInstitutionComponent } from './components/institutions/add-institution/add-institution.component';
import { AddDisciplineComponent } from './components/disciplines/add-discipline/add-discipline.component';
import { AddConferenceComponent } from './components/conferences/add-conference/add-conference.component';
import { SelectDisciplineComponent } from './components/disciplines/select-discipline/select-discipline.component';
import { ListConferencesComponent } from './components/conferences/list-conferences/list-conferences.component';
import { ConferenceDetailComponent } from './components/conferences/conference-detail/conference-detail.component';
import { EditConferenceComponent } from './components/conferences/edit-conference/edit-conference.component';
import { ListConferencesViewComponent } from './components/conferences/list-conferences-view/list-conferences-view.component';
import { EditConferenceViewComponent } from './components/conferences/edit-conference-view/edit-conference-view.component';
import { ConferenceDetailViewComponent } from './components/conferences/conference-detail-view/conference-detail-view.component';
import { AddConferenceViewComponent } from './components/conferences/add-conference-view/add-conference-view.component';
import { ListPanelsViewComponent } from './components/panels/list-panels-view/list-panels-view.component';
import { ListPanelsComponent } from './components/panels/list-panels/list-panels.component';
import { ListPresentationsViewComponent } from './components/presentations/list-presentations-view/list-presentations-view.component';
import { ListPresentationsComponent } from './components/presentations/list-presentations/list-presentations.component';
import { ListPeopleViewComponent } from './components/people/list-people-view/list-people-view.component';
import { ListPeopleComponent } from './components/people/list-people/list-people.component';
import { ListInstitutionsViewComponent } from './components/institutions/list-institutions-view/list-institutions-view.component';
import { ListInstitutionsComponent } from './components/institutions/list-institutions/list-institutions.component';
import { ListTopicsViewComponent } from './components/topics/list-topics-view/list-topics-view.component';
import { ListTopicsComponent } from './components/topics/list-topics/list-topics.component';
import { ListPlacesViewComponent } from './components/places/list-places-view/list-places-view.component';
import { ListPlacesComponent } from './components/places/list-places/list-places.component';
import { PanelDetailViewComponent } from './components/panels/panel-detail-view/panel-detail-view.component';
import { PanelDetailComponent } from './components/panels/panel-detail/panel-detail.component';
import { PresentationDetailViewComponent } from './components/presentations/presentation-detail-view/presentation-detail-view.component';
import { PresentationDetailComponent } from './components/presentations/presentation-detail/presentation-detail.component';
import { InstitutionDetailViewComponent } from './components/institutions/institution-detail-view/institution-detail-view.component';
import { InstitutionDetailComponent } from './components/institutions/institution-detail/institution-detail.component';
import { ListDisciplinesComponent } from './components/disciplines/list-disciplines/list-disciplines.component';
import { ListDisciplinesViewComponent } from './components/disciplines/list-disciplines-view/list-disciplines-view.component';
import { AddDisciplineViewComponent } from './components/disciplines/add-discipline-view/add-discipline-view.component';
import { DisciplineDetailViewComponent } from './components/disciplines/discipline-detail-view/discipline-detail-view.component';
import { DisciplineDetailComponent } from './components/disciplines/discipline-detail/discipline-detail.component';
import { EditDisciplineViewComponent } from './components/disciplines/edit-discipline-view/edit-discipline-view.component';
import { EditDisciplineComponent } from './components/disciplines/edit-discipline/edit-discipline.component';
import { ListLocationsViewComponent } from './components/locations/list-locations-view/list-locations-view.component';
import { ListLocationsComponent } from './components/locations/list-locations/list-locations.component';
import { AddLocationsViewComponent } from './components/locations/add-locations-view/add-locations-view.component';
import { LocationDetailViewComponent } from './components/locations/location-detail-view/location-detail-view.component';
import { LocationDetailComponent } from './components/locations/location-detail/location-detail.component';
import { EditLocationViewComponent } from './components/locations/edit-location-view/edit-location-view.component';
import { EditLocationComponent } from './components/locations/edit-location/edit-location.component';
import { AddInstitutionViewComponent } from './components/institutions/add-institution-view/add-institution-view.component';
import { AddTopicViewComponent } from './components/topics/add-topic-view/add-topic-view.component';
import { AddTopicComponent } from './components/topics/add-topic/add-topic.component';
import { TopicDetailViewComponent } from './components/topics/topic-detail-view/topic-detail-view.component';
import { TopicDetailComponent } from './components/topics/topic-detail/topic-detail.component';
import { EditTopicViewComponent } from './components/topics/edit-topic-view/edit-topic-view.component';
import { EditTopicComponent } from './components/topics/edit-topic/edit-topic.component';
import { AddPlaceViewComponent } from './components/places/add-place-view/add-place-view.component';
import { AddPlaceComponent } from './components/places/add-place/add-place.component';
import { PlaceDetailViewComponent } from './components/places/place-detail-view/place-detail-view.component';
import { PlaceDetailComponent } from './components/places/place-detail/place-detail.component';
import { EditPlaceViewComponent } from './components/places/edit-place-view/edit-place-view.component';
import { EditPlaceComponent } from './components/places/edit-place/edit-place.component';
import { AddPersonViewComponent } from './components/people/add-person-view/add-person-view.component';
import { AddPersonComponent } from './components/people/add-person/add-person.component';
import { PersonDetailViewComponent } from './components/people/person-detail-view/person-detail-view.component';
import { PersonDetailComponent } from './components/people/person-detail/person-detail.component';
import { EditPersonViewComponent } from './components/people/edit-person-view/edit-person-view.component';
import { EditPersonComponent } from './components/people/edit-person/edit-person.component';
import { SelectPersonComponent } from './components/people/select-person/select-person.component';
import { SelectInstitutionComponent } from './components/institutions/select-institution/select-institution.component';
import { SelectLocationComponent } from './components/locations/select-location/select-location.component';
import { SelectConferenceComponent } from './components/conferences/select-conference/select-conference.component';
import { SelectPlaceComponent } from './components/places/select-place/select-place.component';
import { SelectTopicComponent } from './components/topics/select-topic/select-topic.component';
import { EditInstitutionComponent } from './components/institutions/edit-institution/edit-institution.component';
import { EditInstitutionViewComponent } from './components/institutions/edit-institution-view/edit-institution-view.component';
import { SelectPanelComponent } from './components/panels/select-panel/select-panel.component';
import { AddPanelViewComponent } from './components/panels/add-panel-view/add-panel-view.component';
import { AddPanelComponent } from './components/panels/add-panel/add-panel.component';
import { EditPanelViewComponent } from './components/panels/edit-panel-view/edit-panel-view.component';
import { EditPanelComponent } from './components/panels/edit-panel/edit-panel.component';
import { AddPresentationViewComponent } from './components/presentations/add-presentation-view/add-presentation-view.component';
import { AddPresentationComponent } from './components/presentations/add-presentation/add-presentation.component';
import { EditPresentationViewComponent } from './components/presentations/edit-presentation-view/edit-presentation-view.component';
import { EditPresentationComponent } from './components/presentations/edit-presentation/edit-presentation.component';
import { SelectPresentationComponent } from './components/presentations/select-presentation/select-presentation.component';
import { ExportComponent } from './components/export/export.component';
import { FilterComponent } from './components/common/filter/filter.component';
import { NavMenuComponent } from './components/common/nav-menu/nav-menu.component';
import { ConfirmDeleteConferenceDialog } from './components/conferences/conference-detail/conference-detail.component';
import { ConfirmDeleteDisciplineDialog } from './components/disciplines/discipline-detail/discipline-detail.component';
import { ConfirmDeleteInstitutionDialog } from './components/institutions/institution-detail/institution-detail.component';
import { ConfirmDeleteLocationDialog } from './components/locations/location-detail/location-detail.component';
import { ConfirmDeletePanelDialog } from './components/panels/panel-detail/panel-detail.component';
import { ConfirmDeletePersonDialog } from './components/people/person-detail/person-detail.component';
import { ConfirmDeletePlaceDialog } from './components/places/place-detail/place-detail.component';
import { ConfirmDeletePresentationDialog } from './components/presentations/presentation-detail/presentation-detail.component';
import { ConfirmDeleteTopicDialog } from './components/topics/topic-detail/topic-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent,
    HomeIntroComponent,
    HomeCreditsComponent,
    HomeSpecsComponent,
    LoginComponent,
    RegisterComponent,
    PrivacyPolicyComponent,
    ProfileComponent,
    ConfirmRoleChangeDialog,
    UsersComponent,
    ListConferencesViewComponent,
    ListConferencesComponent,
    ListPanelsViewComponent,
    ListPanelsComponent,
    ListPresentationsViewComponent,
    ListPresentationsComponent,
    ListPeopleViewComponent,
    ListPeopleComponent,
    ListInstitutionsViewComponent,
    ListInstitutionsComponent,
    ListTopicsViewComponent,
    ListTopicsComponent,
    ListPlacesViewComponent,
    ListPlacesComponent,
    ListDisciplinesComponent,
    ListDisciplinesViewComponent,
    AddConferenceViewComponent,
    AddLocationComponent,
    AddInstitutionComponent,
    AddDisciplineViewComponent,
    AddDisciplineComponent,
    AddConferenceComponent,
    SelectDisciplineComponent,
    ConferenceDetailComponent,
    EditConferenceComponent,
    EditConferenceViewComponent,
    ConferenceDetailViewComponent,
    PanelDetailViewComponent,
    PanelDetailComponent,
    PresentationDetailViewComponent,
    PresentationDetailComponent,
    InstitutionDetailViewComponent,
    InstitutionDetailComponent,
    DisciplineDetailViewComponent,
    DisciplineDetailComponent,
    EditDisciplineViewComponent,
    EditDisciplineComponent,
    ListLocationsViewComponent,
    ListLocationsComponent,
    AddLocationsViewComponent,
    LocationDetailViewComponent,
    LocationDetailComponent,
    EditLocationViewComponent,
    EditLocationComponent,
    AddInstitutionViewComponent,
    AddTopicViewComponent,
    AddTopicComponent,
    TopicDetailViewComponent,
    TopicDetailComponent,
    EditTopicViewComponent,
    EditTopicComponent,
    AddPlaceViewComponent,
    AddPlaceComponent,
    PlaceDetailViewComponent,
    PlaceDetailComponent,
    EditPlaceViewComponent,
    EditPlaceComponent,
    AddPersonViewComponent,
    AddPersonComponent,
    PersonDetailViewComponent,
    PersonDetailComponent,
    EditPersonViewComponent,
    EditPersonComponent,
    SelectPersonComponent,
    SelectInstitutionComponent,
    SelectLocationComponent,
    SelectConferenceComponent,
    SelectPlaceComponent,
    SelectTopicComponent,
    EditInstitutionComponent,
    EditInstitutionViewComponent,
    SelectPanelComponent,
    AddPanelViewComponent,
    AddPanelComponent,
    EditPanelViewComponent,
    EditPanelComponent,
    AddPresentationViewComponent,
    AddPresentationComponent,
    EditPresentationViewComponent,
    EditPresentationComponent,
    SelectPresentationComponent,
    ExportComponent,
    FilterComponent,
    NavMenuComponent,
    ConfirmDeleteConferenceDialog,
    ConfirmDeleteDisciplineDialog,
    ConfirmDeleteInstitutionDialog,
    ConfirmDeleteLocationDialog,
    ConfirmDeletePanelDialog,
    ConfirmDeletePersonDialog,
    ConfirmDeletePlaceDialog,
    ConfirmDeletePresentationDialog,
    ConfirmDeleteTopicDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatChipsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
