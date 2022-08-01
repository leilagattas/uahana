import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mensajeError: string = "";

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
        if (error.status == 401) {
          this.mensajeError = "El email y/o la contraseña ingresados son incorrectos."
        }
        console.log(error);
      })
    console.log(form.value);
  }

}
