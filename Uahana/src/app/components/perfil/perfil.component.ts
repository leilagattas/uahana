import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
