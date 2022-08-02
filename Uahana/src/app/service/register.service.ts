import { Injectable } from '@angular/core';
import host from './host';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponseData } from '../interfaces/AuthResponseData';
import { User } from '../interfaces/User';
import { Token } from '@angular/compiler';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    host = host[1];
    secure = host[0];
    myAppUrl: string = `${this.secure}://${this.host}:3000/api/v1`

    constructor(private _http: HttpClient, private _authService: AuthService) { }

    headers: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json"
    })

    headersAuth: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this._authService.getToken()
    })

    registerUser(usuario: User): Observable<any> {
        const url_api = this.myAppUrl + "/login/register";
        console.log(url_api, usuario);
        return this._http.post(url_api, usuario, { headers: this.headers });
    }

    updateUser(usuario: User): Observable<any> {
        const url_api = this.myAppUrl + "/login";
        console.log(this._authService.getToken());
        return this._http.put(url_api, usuario, { headers: this.headersAuth });
    }

}
