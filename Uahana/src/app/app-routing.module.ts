import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComofuncionaComponent } from './components/comofunciona/comofunciona.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegisterComponent } from './components/register/register.component';
// import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'perfil', component: PerfilComponent },
  // { path: 'recuperarPass/:id', component: RecuperarPassComponent },
  { path: '**', redirectTo: '/inicio' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
