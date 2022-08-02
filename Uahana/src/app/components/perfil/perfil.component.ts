import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  datosPersonales: boolean = true;
  misTrabajos: boolean = false;
  misSuscripciones: boolean = false;
  favoritos: boolean = false;
  datosUsuarios: object = { Nombre: "", Apellido: "", "DNI": "0", "FechaNacimiento": "01/01/1900", "email": "a@a.com" };

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.getData(this._authService.getToken());
  }

  getData(token: any) {
    let dataUsuario = this._authService.getTokenData(token);
    this.datosUsuarios = dataUsuario as Object;
  }
}
