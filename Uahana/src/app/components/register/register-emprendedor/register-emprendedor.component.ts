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

  constructor(private _router: Router, private _registerService: RegisterService) { }


  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.mensajeError = "Faltan campos por completar."
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
      fechaNacimiento: form.value.date,
      dni: form.value.dni,
      email: form.value.email,
      password: form.value.password,
      tipoUsuario: 1
    };

    console.log(usuarioNuevo);

    if (usuarioNuevo == null) {
      return;
    }

    console.log("viene aca");

    this._registerService.registerUser(usuarioNuevo).subscribe(resData => {
      console.log(resData);
    },
      error => {
        console.log(error);
      })
  }

}
