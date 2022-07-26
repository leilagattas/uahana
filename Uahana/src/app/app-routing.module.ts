import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargarTrabajoComponent } from './components/register/register-emprendedor/cargar-trabajo/cargar-trabajo.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegisterComponent } from './components/register/register.component';
import { ElegirSuscripcionComponent } from './components/register/register-emprendedor/elegir-suscripcion/elegir-suscripcion.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
// import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'cargarTrabajo', component: CargarTrabajoComponent },
  { path: 'elegirSuscripcion', component: ElegirSuscripcionComponent },
  { path: 'busqueda', component: BusquedaComponent },

  // { path: 'recuperarPass/:id', component: RecuperarPassComponent },
  { path: '**', redirectTo: '/inicio' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
