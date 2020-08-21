import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data.roles as string[];
    if (roles && roles.length > 0) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['/home']);
        this.alertify.error('Not authorized to access this area!');
      }
    }
    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error('Not logged in!');
    this.router.navigate(['/home']);
    return false;
  }
}
