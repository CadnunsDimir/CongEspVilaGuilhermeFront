import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Api1Service } from "../api1service";

export interface UserPayload {
  email: string;
  username: string;
  password: string;
}

export interface UserSaveResponse {
  userName: string;
  status: string;
  statusCode: number;
}

export interface UserListItem {
  email: string;
  userName: string;
  roles: string[]
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users$ = new BehaviorSubject<UserListItem[]>([]);

  public get users$(){
    var users = this._users$.getValue();
    if(users.length == 0) {
      this.updateUserList();
    }
    return this._users$.asObservable();
  }

  constructor(private readonly api: Api1Service) { }

  createOrUpdateUser(user: UserPayload): Observable<UserSaveResponse> {
    return this.api.post<UserSaveResponse>('user', user, true);
  }

  updateRole(username: string, role: string): Observable<unknown> {
    const safeUsername = encodeURIComponent(username);
    const safeRole = encodeURIComponent(role);
    return this.api.get(`user/${safeUsername}/role/${safeRole}`, true);
  }

  updateUserList(){
    this.api.get<UserListItem[]>(`user`, true)
      .subscribe(x=> this._users$.next(x));
  }
}
