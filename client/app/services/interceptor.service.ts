import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * InterceptorService intercepts every http request and attached necessary jwt for
 * server authentication.
 */
@Injectable()
export class InterceptorService {

  constructor(private _auth: AuthService) { }

  /**
   * Intercepts an http request and attaches authentication data
   * 
   * @param request - Request data to which the token info must be attached
   * @param next - Handler which will then execute on the response object
   * @returns - The result of the handler's response
   */
  intercept (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if no header parameters detected
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json')});
    }
    // otherwise set auth
    request = request.clone({ headers: request.headers.set('Accept', 'application/json')}).clone({
      setHeaders: {
        Authorization: `${this._auth.getToken()}`
      }
    });
    return next.handle(request);
  }
}
