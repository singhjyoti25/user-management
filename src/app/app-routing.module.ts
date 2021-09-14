import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { NewComponentComponent } from './new-component/new-component.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  { path:"",component:LoginComponent},
  { path:"login",component:LoginComponent },
  { path:"user-detail",component:UserDetailComponent, canActivate: [AuthGuard],data: {role: 'user'}},
  { path:"admin-dashboard",component:AdminDashboardComponent, canActivate: [AuthGuard],data: {role: 'admin'}},
  { path:"signup",component:SignupComponent },
  { path:"edit-detail",component:NewComponentComponent,canActivate: [AuthGuard],data: {role: 'user'} },
  { path:"add-user",component:AddUserComponent, canActivate: [AuthGuard],data: {role: 'admin'}},
  { path:"edit-user/:userId",component:EditUserComponent, canActivate: [AuthGuard],data: {role: 'admin'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
