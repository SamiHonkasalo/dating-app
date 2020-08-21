import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/user-params';
import { MessageParams } from '../_models/message-params';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) {}

  getUsers(
    page?: number,
    itemsPerPage?: number,
    userParams?: UserParams
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (userParams) {
      params = userParams.minAge
        ? params.append('minAge', userParams.minAge.toString())
        : params;
      params = userParams.maxAge
        ? params.append('maxAge', userParams.maxAge.toString())
        : params;
      params = userParams.gender
        ? params.append('gender', userParams.gender)
        : params;
      params = userParams.orderBy
        ? params.append('orderBy', userParams.orderBy)
        : params;
    }

    if (userParams?.like === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (userParams?.like === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http
      .get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((res) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + '/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + '/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + '/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, messageParams?: MessageParams) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params = messageParams?.messageContainer
      ? params.append('MessageContainer', messageParams.messageContainer)
      : params;

    params = messageParams?.page
      ? params.append('pageNumber', messageParams.page.toString())
      : params;
    params = messageParams?.itemsPerPage
      ? params.append('pageSize', messageParams.itemsPerPage.toString())
      : params;

    return this.http
      .get<Message[]>(this.baseUrl + '/' + id + '/messages', {
        observe: 'response',
        params,
      })
      .pipe(
        map((res) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + '/' + id + '/messages/thread/' + recipientId
    );
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + '/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this.http
      .post(
        this.baseUrl + '/' + userId + '/messages/' + messageId + '/read',
        {}
      )
      .subscribe();
  }
}
