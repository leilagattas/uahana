import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggingService } from 'src/app/logging.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [LoggingService]
})
export class MainComponent implements OnInit {
  titulo1: string = "";
  descripcion1: string = "";
  namePict1: string = "";
  titulo2: string = "";
  descripcion2: string = "";
  namePict2: string = "";
  titulo3: string = "";
  descripcion3: string = "";
  namePict3: string = "";
  titulo4: string = "";
  descripcion4: string = "";
  namePict4: string = "";
  textSearch: string = "";

  constructor(private _router: Router,
    private _loggingService: LoggingService) { }

  ngOnInit(): void {
    this._router.navigate(['/comoFunciona']);
    this.valuesCompRend()
  }

  changeBusqueda(e: any) {
    this.textSearch = e.path[0].innerHTML;
    this.goBusqueda();
  }

  valuesCompRend() {
    this.titulo1 = "Picadas para eventos";
    this.descripcion1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    this.namePict1 = "destacados1";
    this.titulo2 = "Masajista a domicilio";
    this.descripcion2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    this.namePict2 = "destacados2";
    this.titulo3 = "Pintor por hora";
    this.descripcion3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    this.namePict3 = "destacados3";
    this.titulo4 = "Profe de Guitarra";
    this.descripcion4 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    this.namePict4 = "destacados4";
  }

  goBusqueda() {
    this._loggingService.logInfo(this.textSearch);
    this._router.navigateByUrl('/busqueda/' + this.textSearch);
  }

}

