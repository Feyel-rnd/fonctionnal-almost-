import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class YourGuard implements CanActivate {
  constructor(public router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (sessionStorage.getItem("userId")!=undefined && sessionStorage.getItem("userId")!=""){
    return true;}
    else {
      const redirectUrl = '/login';
  
          // Redirect the user
          this.router.navigate([redirectUrl]);
      return false
    }
  }
}
