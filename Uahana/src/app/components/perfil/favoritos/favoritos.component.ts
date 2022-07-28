import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  descripcion: string[] = [];
  imgName: string[] = [];
  titulos: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.valuesCompRend();
  }

  valuesCompRend() {
    this.imgName = ["destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png", "destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png", "destacados1.png", "destacados2.png", "destacados3.png", "destacados4.png"]
    this.titulos = ["Picadas para eventos", "Masajista a domicilio", "Pintor por hora", "Profe de Guitarra", "se", "de", "el2", "y", "a", "b", "a", "b"]
    this.descripcion = ["Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
  }


}
