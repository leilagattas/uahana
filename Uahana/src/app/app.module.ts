import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoginComponent } from './components/login/login.component';
import { ComofuncionaComponent } from './components/main/comofunciona/comofunciona.component';
import { SuscripcionesComponent } from './components/suscripciones/suscripciones.component';
import { FormaparteComponent } from './components/main/formaparte/formaparte.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterEmprendedorComponent } from './components/register/register-emprendedor/register-emprendedor.component';
import { RegisterClienteComponent } from './components/register/register-cliente/register-cliente.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DatosPersonalesComponent } from './components/perfil/datos-personales/datos-personales.component';
import { MisTrabajosComponent } from './components/perfil/mis-trabajos/mis-trabajos.component';
import { MisSuscripcionesComponent } from './components/perfil/mis-suscripciones/mis-suscripciones.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CargarTrabajoComponent } from './components/register/register-emprendedor/cargar-trabajo/cargar-trabajo.component';
import { ElegirSuscripcionComponent } from './components/register/register-emprendedor/elegir-suscripcion/elegir-suscripcion.component';

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
    FormaparteComponent,
    RegisterComponent,
    RegisterEmprendedorComponent,
    RegisterClienteComponent,
    ContactoComponent,
    DatosPersonalesComponent,
    MisTrabajosComponent,
    MisSuscripcionesComponent,
    PerfilComponent,
    CargarTrabajoComponent,
    ElegirSuscripcionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
