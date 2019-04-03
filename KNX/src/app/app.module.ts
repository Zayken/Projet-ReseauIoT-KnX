import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AuthService} from './services/auth.service';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuardService} from './services/auth-guard.service';
import {RouterModule, Routes, CanActivate} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { KNXComponent } from './knx/knx.component';
import { MaquetteComponent } from './maquette/maquette.component';
import { KNXService } from './services/knx.service';
import { MaquetteViewComponent } from './maquette-view/maquette-view.component';
import { ConnectGuardService } from './connect-guard.service';
import { TestComponent } from './test/test.component';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'test', component: TestComponent },
  { path: 'knx', canActivate: [AuthGuardService], component: KNXComponent },  
  { path: 'maquette', canActivate: [AuthGuardService,ConnectGuardService], component: MaquetteViewComponent },
  { path: '**', redirectTo: 'knx' }
];
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HeaderComponent,
    KNXComponent,
    MaquetteComponent,
    MaquetteViewComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService,AuthGuardService,KNXService],
  bootstrap: [AppComponent]
})
export class AppModule { }