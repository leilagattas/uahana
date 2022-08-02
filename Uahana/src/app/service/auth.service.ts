import { Injectable } from '@angular/core';
import host from './host';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponseData } from '../interfaces/AuthResponseData';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  host = host[1];
  secure = host[0];
  myAppUrl: string = `${this.secure}://${this.host}:3000/api/v1`

  constructor(private _http: HttpClient) { }


  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  loginUser(usuario: string, password: string): Observable<any> {
    const url_api = this.myAppUrl + "/login";
    let user = {
      email: usuario,
      password: password
    }
    return this._http.post(url_api, user, { headers: this.headers })
  }

  setToken(token: string): void {
    localStorage.setItem("accessToken", token)
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

  getTokenData(token: string) {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
