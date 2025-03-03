import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; // npm i jwt-decode
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import { UserStore } from '../storage/user-store';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private userStore = inject(UserStore);

    public constructor() {
        const token = localStorage.getItem("token");
        if(!token) return;
        const payload = jwtDecode<{ user: UserModel }>(token);
        const dbUser = payload.user;
        this.userStore.initUser(dbUser);
    }

    public async register(user: UserModel): Promise<void> {
        const token$ = this.http.post<string>(environment.registerUrl, user);
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: UserModel }>(token);
        const dbUser = payload.user;
        this.userStore.initUser(dbUser);
        localStorage.setItem("token", token);
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const token$ = this.http.post<string>(environment.loginUrl, credentials);
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: UserModel }>(token);
        const dbUser = payload.user;
        this.userStore.initUser(dbUser);
        localStorage.setItem("token", token);
    }

    public logout(): void {
        this.userStore.logoutUser();
        localStorage.removeItem("token");
    }

}
