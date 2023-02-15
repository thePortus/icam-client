import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminService {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let userDetails$: Observable<User>;
    let user = { 'role' : 'None' };
    userDetails$ = this._userService.user$;
    userDetails$.subscribe(result => {
      user = result;
    });
    if (user.role == 'Owner' || user.role == 'Editor') {
      return true;
    }

    // navigate to home page
    this._router.navigate(['/home']);
    return false;
  }
}
