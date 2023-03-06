// external imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/common/privacy-policy/privacy-policy.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ListConferencesViewComponent } from './components/conferences/list-conferences-view/list-conferences-view.component';
import { EditConferenceViewComponent } from './components/conferences/edit-conference-view/edit-conference-view.component';
import { ConferenceDetailViewComponent } from './components/conferences/conference-detail-view/conference-detail-view.component';
import { AddConferenceViewComponent } from './components/conferences/add-conference-view/add-conference-view.component';
import { ListPanelsViewComponent } from './components/panels/list-panels-view/list-panels-view.component';
import { PanelDetailViewComponent } from './components/panels/panel-detail-view/panel-detail-view.component';
import { EditPanelViewComponent } from './components/panels/edit-panel-view/edit-panel-view.component';
import { AddPanelViewComponent } from './components/panels/add-panel-view/add-panel-view.component';
import { ListPresentationsViewComponent } from './components/presentations/list-presentations-view/list-presentations-view.component';
import { PresentationDetailViewComponent } from './components/presentations/presentation-detail-view/presentation-detail-view.component';
import { EditPresentationViewComponent } from './components/presentations/edit-presentation-view/edit-presentation-view.component';
import { AddPresentationViewComponent } from './components/presentations/add-presentation-view/add-presentation-view.component';
import { ListPeopleViewComponent } from './components/people/list-people-view/list-people-view.component';
import { EditPersonViewComponent } from './components/people/edit-person-view/edit-person-view.component';
import { PersonDetailViewComponent } from './components/people/person-detail-view/person-detail-view.component';
import { AddPersonViewComponent } from './components/people/add-person-view/add-person-view.component';
import { ListInstitutionsViewComponent } from './components/institutions/list-institutions-view/list-institutions-view.component';
import { AddInstitutionViewComponent } from './components/institutions/add-institution-view/add-institution-view.component';
import { InstitutionDetailViewComponent } from './components/institutions/institution-detail-view/institution-detail-view.component';
import { EditInstitutionViewComponent } from './components/institutions/edit-institution-view/edit-institution-view.component';
import { ListTopicsViewComponent } from './components/topics/list-topics-view/list-topics-view.component';
import { AddTopicViewComponent } from './components/topics/add-topic-view/add-topic-view.component';
import { TopicDetailViewComponent } from './components/topics/topic-detail-view/topic-detail-view.component';
import { EditTopicViewComponent } from './components/topics/edit-topic-view/edit-topic-view.component';
import { ListPlacesViewComponent } from './components/places/list-places-view/list-places-view.component';
import { AddPlaceViewComponent } from './components/places/add-place-view/add-place-view.component';
import { PlaceDetailViewComponent } from './components/places/place-detail-view/place-detail-view.component';
import { EditPlaceViewComponent } from './components/places/edit-place-view/edit-place-view.component';
import { ListDisciplinesViewComponent } from './components/disciplines/list-disciplines-view/list-disciplines-view.component';
import { AddDisciplineViewComponent } from './components/disciplines/add-discipline-view/add-discipline-view.component';
import { DisciplineDetailViewComponent } from './components/disciplines/discipline-detail-view/discipline-detail-view.component';
import { EditDisciplineViewComponent } from './components/disciplines/edit-discipline-view/edit-discipline-view.component';
import { ListLocationsViewComponent } from './components/locations/list-locations-view/list-locations-view.component';
import { AddLocationsViewComponent } from './components/locations/add-locations-view/add-locations-view.component';
import { LocationDetailViewComponent } from './components/locations/location-detail-view/location-detail-view.component';
import { EditLocationViewComponent } from './components/locations/edit-location-view/edit-location-view.component';
import { ExportComponent } from './components/export/export.component';

// service imports
import { AuthGuardService } from './services/auth-guard.service';
import { IsAdminService } from './services/is-admin.service';

const routes: Routes = [
  // Set routes, designating middleware to check if user is logged in/an admin for certain routes
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', canActivate: [AuthGuardService], component: ProfileComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'conferences', component: ListConferencesViewComponent },
  { path: 'conferences/add', canActivate: [AuthGuardService, IsAdminService], component: AddConferenceViewComponent },
  { path: 'conferences/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditConferenceViewComponent },
  { path: 'conferences/:id', component: ConferenceDetailViewComponent },
  { path: 'panels', component: ListPanelsViewComponent },
  { path: 'panels/add', canActivate: [AuthGuardService, IsAdminService], component: AddPanelViewComponent },
  { path: 'panels/:id', component: PanelDetailViewComponent },
  { path: 'panels/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditPanelViewComponent },
  { path: 'presentations', component: ListPresentationsViewComponent },
  { path: 'presentations/add', canActivate: [AuthGuardService, IsAdminService], component: AddPresentationViewComponent },
  { path: 'presentations/:id', component: PresentationDetailViewComponent },
  { path: 'presentations/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditPresentationViewComponent },
  { path: 'people', component: ListPeopleViewComponent },
  { path: 'people/add', canActivate: [AuthGuardService, IsAdminService], component: AddPersonViewComponent },
  { path: 'people/:id', component: PersonDetailViewComponent },
  { path: 'people/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditPersonViewComponent },
  { path: 'institutions', component: ListInstitutionsViewComponent },
  { path: 'institutions/add', canActivate: [AuthGuardService, IsAdminService], component: AddInstitutionViewComponent },
  { path: 'institutions/:id', component: InstitutionDetailViewComponent },
  { path: 'institutions/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditInstitutionViewComponent },
  { path: 'topics', component: ListTopicsViewComponent },
  { path: 'topics/add', canActivate: [AuthGuardService, IsAdminService], component: AddTopicViewComponent },
  { path: 'topics/:id', component: TopicDetailViewComponent },
  { path: 'topics/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditTopicViewComponent },
  { path: 'places', component: ListPlacesViewComponent },
  { path: 'places/add', canActivate: [AuthGuardService, IsAdminService], component: AddPlaceViewComponent },
  { path: 'places/:id', component: PlaceDetailViewComponent },
  { path: 'places/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditPlaceViewComponent },
  { path: 'disciplines', canActivate: [AuthGuardService, IsAdminService], component: ListDisciplinesViewComponent },
  { path: 'disciplines/add', canActivate: [AuthGuardService, IsAdminService], component: AddDisciplineViewComponent },
  { path: 'disciplines/:id', canActivate: [AuthGuardService, IsAdminService], component: DisciplineDetailViewComponent },
  { path: 'disciplines/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditDisciplineViewComponent },
  { path: 'locations', canActivate: [AuthGuardService, IsAdminService], component: ListLocationsViewComponent },
  { path: 'locations/add', canActivate: [AuthGuardService, IsAdminService], component: AddLocationsViewComponent },
  { path: 'locations/:id', canActivate: [AuthGuardService, IsAdminService], component: LocationDetailViewComponent },
  { path: 'locations/edit/:id', canActivate: [AuthGuardService, IsAdminService], component: EditLocationViewComponent },
  { path: 'export', canActivate: [AuthGuardService, IsAdminService], component: ExportComponent },
  // redirects root to home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // set 404 component and redirect all other entered routes to 404
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
