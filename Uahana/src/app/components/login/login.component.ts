import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mensajeError: string = "";

  constructor(private _router: Router, private _authService: AuthService) { }

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
      this._authService.setToken(resData.token);
      this._router.navigateByUrl("/inicio")
        .then(() => {
          window.location.reload();
        });;;
    },
      error => {
        if (error.status == 401) {
          this.mensajeError = "El email y/o la contraseña ingresados son incorrectos."
        }
        if (error.status == 400) {
          this.mensajeError = "Debe validar su cuenta a partir del correo enviado."
        }
      })
  }

}
