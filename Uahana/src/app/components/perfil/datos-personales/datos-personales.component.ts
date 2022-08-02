import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { RegisterService } from 'src/app/service/register.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {

  editable: boolean = false;
  nombreNoEditable: string = "";
  usuarioUpdate: any = {
    Nombre: "",
    Apellido: "",
    email: "",
    FechaNacimiento: "",
    DNI: ""
  };

  @Input() datosUser: any = {};

  private notifier: NotifierService;

  constructor(private _router: Router,
    private _authService: AuthService,
    private _registerService: RegisterService,
    notifierService: NotifierService) {
    this.notifier = notifierService;
  }


  ngOnInit(): void {
    console.log(this.datosUser);
    this.nombreNoEditable = this.datosUser.Nombre;
    this.usuarioUpdate = {
      Nombre: this.datosUser.Nombre,
      Apellido: this.datosUser.Apellido,
      email: this.datosUser.email,
      FechaNacimiento: this.datosUser.FechaNacimiento,
      DNI: this.datosUser.DNI
    };
  }

  onLogout() {
    this._authService.deleteToken();
    this._router.navigateByUrl("/inicio")
      .then(() => {
        window.location.reload();
      });;
  }

  updateUser() {
    console.log(this.usuarioUpdate);
    console.log(this.datosUser);
    if (this.usuarioUpdate.email == this.datosUser.email) {
      this._registerService.updateUser(this.usuarioUpdate).subscribe(data => {
        this.notifier.notify('success', "Usuario actualizado exitosamente!");
      },
        error => {
          console.log(error);
          this.notifier.notify('warning', "Ocurrió un error intentando actualizar..");
        })
    }
  }



}
