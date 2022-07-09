import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
// import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: MainComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'recuperarPass', component: RecuperarPassComponent },
  // { path: 'recuperarPass/:id', component: RecuperarPassComponent },
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
