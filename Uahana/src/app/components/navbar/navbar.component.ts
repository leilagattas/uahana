import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  textSearch: string = "";
  logged: boolean = false;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _authService: AuthService) { }

  ngOnInit(): void {
    this.checkLogged()
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

  checkLogged() {
    let token = this._authService.getToken();
    if (token != null) {
      this.logged = true;
    }
  }

  goProfile() {
    this._router.navigateByUrl("/perfil");
  }

}
