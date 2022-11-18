import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class JuryGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (sessionStorage.getItem('role') == 'Jury') {
      return true;
    } else {
      const redirectUrl = '/dashboard';

      // Redirect the user
      this.router.navigate([redirectUrl]);
      return false;
    }
  }
}
