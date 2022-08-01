import { Injectable } from '@angular/core';
import host from './host';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponseData } from '../interfaces/AuthResponseData';
import { User } from '../interfaces/User';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    host = host[1];
    secure = host[0];
    myAppUrl: string = `${this.secure}://${this.host}:3000/api/v1`

    constructor(private _http: HttpClient) { }

    headers: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json"
    })

    registerUser(usuario: User): Observable<any> {
        const url_api = this.myAppUrl + "/login/register";
        console.log(url_api, usuario);
        return this._http.post(url_api, usuario, { headers: this.headers });
    }

}
