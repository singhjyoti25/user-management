import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare const showLoader:any;
declare const hideLoader:any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor
  (
    private http:HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  showLoader(){
    showLoader();
  }

  hideLoader(){
    hideLoader();
  }

  getUserName(){
    const userData = JSON.parse(localStorage.getItem(environment.dataStore.userData));
    if(userData!=null && userData!=''){
      return userData.username;
    }
  }

  isLoggedIn(){
    const currentUser = JSON.parse(localStorage.getItem(environment.dataStore.userData));
    if(currentUser!=null && currentUser!=''){
      return true;
    }else{
      return false;
    }
  }

  getCurrentUserId(){
    const currentUser = JSON.parse(localStorage.getItem(environment.dataStore.userData));
    return (currentUser != null )? currentUser.id : 0;
  }

  getUserDetails(){
    const currentUser = JSON.parse(localStorage.getItem(environment.dataStore.userData));
    if(currentUser!=null){
      return currentUser;
    }
  }

  getUserRole(){
    const currentUser = this.getUserDetails();
    if(currentUser!=null && currentUser!=''){
      return currentUser.role;
    }
  }

  logout() {
    localStorage.removeItem(environment.dataStore.userData);
    this.router.navigate(['/login']);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  }

  login(){
    //return this.http.get<any>(`${this.apiUrl}`);
    return this.http.get<any>('/api/users');
  }

  signup(formData){
    return this.http.post<any>('/api/users',formData);
  }

  deleteUser(id){
    return this.http.delete<any>(`/api/users/${id}`);
  }

  //Return User list 
  getAllUser(){
    return this.http.get<any>('/api/users');
  }

  //REturn user by Id
  getUser(id){
    return this.http.get<any>(`/api/users/${id}`);
  }

  //Edit user by Id

  editUser(formData,id){
    
    return this.http.patch<any>(`/api/users/${id}`, formData);
  }

  toastSuccess(message,data={}){
    this.toastr.success(message, 'success');
  }

  toastError(message,data={}){
    this.toastr.error(message, 'error');
  }
}
