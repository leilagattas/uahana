import { Injectable } from '@angular/core';
import host from './host';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponseData } from '../interfaces/AuthResponseData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  host = host[1];
  secure = host[0];
  myAppUrl: string = `${this.secure}://${this.host}:4000`

  constructor(private _http: HttpClient) { }


  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  loginUser(usuario: string, password: string): Observable<any> {
    const url_api = this.myAppUrl + "/user/login";
    // return this._http
    //   .post<UserInterface>(url_api, { usuario, password })
    //   .pipe(map(data => data))
    return this._http.post<AuthResponseData>(url_api,
      {
        usuario: usuario,
        password: password,
        returnSecureToken: true
      })
  }

  setToken(token: string): void {
    localStorage.setItem("accessToken", token)
  }

  decrypt(token: string): Observable<any> {
    console.log(this.myAppUrl)
    return this._http.get(this.myAppUrl + `/user/decrypt/${token}`)
  }

  getToken() {
    return localStorage.getItem("accessToken")
  }

  deleteToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
  }

  getLoginStatus() {
    if (localStorage.getItem("accessToken") != null) {
      return false;
    }
    else {
      return true;
    }
  }

}
