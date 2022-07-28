import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  textSearch: string = "";

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getRoute();
  }

  goBusqueda() {
    console.log(this.textSearch);
    this._router.navigateByUrl('/busqueda/' + this.textSearch);
  }

  getRoute() {
    // let r = this._router.getCurrentNavigation();
    // console.log(r);
    let id = this._activatedRoute.snapshot.paramMap.get('textSearch');
    console.log(id);

    this._activatedRoute.paramMap.subscribe(params => {
      id = params.get('textSearch');
    });
    console.log(id);

  }

}
