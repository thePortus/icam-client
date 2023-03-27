import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserService } from './user.service';

/**
 * IsAdminService prevents users who are not administrators from accessing certain routes.
 */
@Injectable({
  providedIn: 'root'
})
export class IsAdminService {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  /**
   * Returns true if user is logged in and is an admin. Middleware
   * function to prevent users who are not admins from accessing certain
   * routes.
   * 
   * @param next - Snapshot of desired route change
   * @param state - Snapshot of current route
   * @returns Boolean t/f whether the user is an admin
   */
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
