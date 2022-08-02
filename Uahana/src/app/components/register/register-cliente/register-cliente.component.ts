import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register-cliente',
  templateUrl: './register-cliente.component.html',
  styleUrls: ['./register-cliente.component.css']
})
export class RegisterClienteComponent implements OnInit {

  mensajeError: string = "";
  typePass: string = "password";
  rtaError: boolean = false;
  mensajeRespuesta: string = "";
  loading: boolean = false;

  constructor(private _router: Router, private _registerService: RegisterService) { }


  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.mensajeError = "Faltan campos por completar o tienen un formato incorrecto."
      return;
    }

    if (form.value.password != form.value.passwordRep) {
      this.mensajeError = "Las contraseñas deben coincidir."
      return;
    }

    const checkbox = document.getElementById(
      'terminos',
    ) as HTMLInputElement | null;

    if (!checkbox?.checked) {
      this.mensajeError = "Debe aceptar los términos y condiciones."
      return;
    } else {
      console.log('Checkbox is checked');
    }

    let usuarioNuevo: User = {
      nombre: form.value.name,
      apellido: form.value.surname,
      fechaNacimiento: new Date(),
      dni: BigInt(123456789),
      email: form.value.email,
      password: form.value.password,
      tipoUsuario: 0
    };

    if (usuarioNuevo == null) {
      return;
    }


    this._registerService.registerUser(usuarioNuevo).subscribe(resData => {
      console.log(resData);
      this.rtaError = false;
      this.mensajeRespuesta = "El usuario fue correctamente creado. Hemos enviado un mail a su correo para validar la cuenta.."
    },
      error => {
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
