import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoginComponent } from './components/login/login.component';
import { ComofuncionaComponent } from './components/comofunciona/comofunciona.component';
import { SuscripcionesComponent } from './components/suscripciones/suscripciones.component';
import { FormaparteComponent } from './components/formaparte/formaparte.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    FooterComponent,
    SpinnerComponent,
    LoginComponent,
    ComofuncionaComponent,
    SuscripcionesComponent,
    FormaparteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
