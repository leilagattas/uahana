import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const usuario = form.value.usuario;
    const password = form.value.password;
    this._authService.loginUser(usuario, password).subscribe(resData => {
      console.log(resData);
    },
      error => {
        console.log(error);
      })
    console.log(form.value);
  }

}
