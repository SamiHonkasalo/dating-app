import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/message-params';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer: MessageParams['messageContainer'] = 'Unread';
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(): Observable<Message[]> {
    return this.userService
      .getMessages(this.authService.decodedToken.nameid, {
        page: this.pageNumber,
        itemsPerPage: this.pageSize,
        messageContainer: this.messageContainer,
      })
      .pipe(
        catchError(() => {
          this.alertify.error('Problem retrieving messages');
          this.router.navigate(['/home']);
          return of(null);
        })
      );
  }
}
