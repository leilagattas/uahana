import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-emprendedor',
  templateUrl: './register-emprendedor.component.html',
  styleUrls: ['./register-emprendedor.component.css']
})
export class RegisterEmprendedorComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  createAccount() {
    // this._router.navigateByUrl("/cargarTrabajo");
  }

}
