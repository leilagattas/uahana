import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rdo-busqueda',
  templateUrl: './rdo-busqueda.component.html',
  styleUrls: ['./rdo-busqueda.component.css']
})

export class RdoBusquedaComponent implements OnInit, OnChanges {

  descripcion: string[] = [];
  imgName: string[] = [];
  titulos: string[] = [];
  @Input() tipoDisplay: string = "";

  constructor() { }

  ngOnInit(): void {
    this.valuesCompRend();
    console.log(this.tipoDisplay);
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }

  valuesCompRend() {
    this.imgName = ["destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png", "destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png", "destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png"]
    this.titulos = ["Picadas para eventos", "Masajista a domicilio", "Pintor por hora", "Profe de Guitarra", "se", "de", "el2", "y", "a", "b", "a", "b"]
    this.descripcion = ["Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
  }

}
