import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { IdeasComponent } from './pages/ideas/ideas.component';

import { AuthGuard } from './pages/guards/auth.guard';

export const router: Routes = [
    //{ path: '', redirectTo: 'ideas', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: '', component: IdeasComponent, canActivate: [AuthGuard] }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);