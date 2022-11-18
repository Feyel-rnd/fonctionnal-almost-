import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(public router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (sessionStorage.getItem("userId")=="63429fec8679d1a724204416"){
    return true;}
    else {
      const redirectUrl = '/dashboard';
  
          // Redirect the user
          this.router.navigate([redirectUrl]);
      return false
    }
  }
}
