import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/service/register.service';
import { User } from '../../../interfaces/User';

@Component({
  selector: 'app-register-emprendedor',
  templateUrl: './register-emprendedor.component.html',
  styleUrls: ['./register-emprendedor.component.css']
})
export class RegisterEmprendedorComponent implements OnInit {

  mensajeError: string = "";
  typePass: string = "password";
  loading: boolean = false;
  mensajeRespuesta: string = "";
  rtaError: boolean = false;

  constructor(private _router: Router, private _registerService: RegisterService) { }


  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);


    this.loading = true;
    this.mensajeError = "";

    if (!form.valid) {
      this.mensajeError = "Faltan campos por completar o tienen un formato incorrecto."
      this.loading = false;
      return;
    }

    if (form.value.password != form.value.passwordRep) {
      this.mensajeError = "Las contraseñas deben coincidir."
      this.loading = false;
      return;
    }

    const checkbox = document.getElementById(
      'terminos',
    ) as HTMLInputElement | null;

    if (!checkbox?.checked) {
      this.mensajeError = "Debe aceptar los términos y condiciones."
      this.loading = false;
      return;
    }

    let usuarioNuevo: User = {
      nombre: form.value.name,
      apellido: form.value.surname,
      fechaNacimiento: form.value.date,
      dni: form.value.dni,
      email: form.value.email,
      password: form.value.password,
      tipoUsuario: 1
    };

    if (usuarioNuevo == null) {
      this.loading = false;
      return;
    }

    this._registerService.registerUser(usuarioNuevo).subscribe(resData => {
      console.log(resData);
      this.rtaError = false;
      this.mensajeRespuesta = "El usuario fue correctamente creado. Hemos enviado un mail a su correo para validar la cuenta.."
    },
      error => {
        console.log(error);
        let msjError = error.error.message;
        this.rtaError = true;
        this.mensajeRespuesta = "Ocurrió un error al intentar crear el usuario";
        if (msjError)
          this.mensajeRespuesta = msjError;
      })
    this.loading = false;
  }

  changeVisibility() {
    this.typePass == "password" ? this.typePass = "text" : this.typePass = "password";
  }

}
