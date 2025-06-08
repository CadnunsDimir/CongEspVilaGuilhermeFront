import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, take } from 'rxjs';
import { CongApiBaseService } from '../cong-api-base.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ApiError } from '../../models/error.model';

export interface ResetPasswordBody {
  newPassword:	string;
  resetPasswordId:	string;
  username: string;
};

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {
  constructor(private readonly api: CongApiBaseService, 
    private readonly notifications: NotificationsService) {
  }

  private withErrorCatching($request: Observable<any>){
    return $request.pipe(
      take(1),
      catchError(({ error }: {error: ApiError}) => {
        const message = error.title.split(', ')[1] ?? error.title;
        this.notifications.send({ message, type: 'error' });
        return EMPTY;
      }));
  }

  initRecovery(username: null | undefined) {
    return this.withErrorCatching(this.api.get(`user/${username}/reset-password`));
  }
  

  finishRecovery(data: ResetPasswordBody){
    const { username, ...body } = data;
    return this.withErrorCatching(this.api.post(`user/${username}/reset-password`, body, false));
  }
}
