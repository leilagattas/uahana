import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-trabajos',
  templateUrl: './mis-trabajos.component.html',
  styleUrls: ['./mis-trabajos.component.css']
})
export class MisTrabajosComponent implements OnInit {
  faltante: string = "";
  botonFaltante: string = "";

  constructor() { }

  ngOnInit(): void {
    this.faltante = "Todavía no tenés ningún trabajo publicado."
    this.botonFaltante = "Publicar emprendimiento y elegir plan"
  }

  otrasOpciones() {
    this.faltante = "Aún no has subido las imagenes o videos de tu empremdimiento."
    this.botonFaltante = "Subir Ahora"

    this.faltante = "Aún no has elegido tu exposición ni suscripción. Este paso es necesario para publicar tu emprendimiento."
    this.botonFaltante = "Elegir suscripción"
  }

}
