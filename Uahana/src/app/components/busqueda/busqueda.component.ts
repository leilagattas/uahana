import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  listaView: boolean = false;
  gridView: boolean = false;
  tipoDisplay: string = "grid";

  constructor() { }

  ngOnInit(): void {
    this.gridView = true;
  }

  changeDisplay(tipo: string) {
    this.listaView = !this.listaView;
    this.gridView = !this.gridView;
    this.tipoDisplay = tipo;
  }

}
