import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  userList:any={};

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.getUser();
  }

  getUser(){
    const id = this.authService.getCurrentUserId();
    this.authService.getUser(id).subscribe(d=>{
      this.userList = d;
    },err => {
      console.log(err);
      this.authService.toastError('Failed!');
    });
  }

  /**
   * Logout User
   */

   logout(){
    this.authService.logout();
   }

}
