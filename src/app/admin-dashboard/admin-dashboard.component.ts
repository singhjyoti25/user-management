import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userList:any=[];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.getAllUser();
  }

  getAllUser(){
    this.authService.getAllUser().subscribe(d=>{

      this.userList = d;
    },err => {
      console.log(err);
      this.authService.toastError('Failed!');
    });
  }

   /**
   * Delete User
   * @param id 
   */
    deleteUser(id){
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to delete this user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.deleteUser(id).subscribe(d=>{

            this.authService.toastSuccess('User deleted successfully!');
            this.getAllUser();
          },err => {
            console.log(err);
            this.authService.toastError('Failed!');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'User is safe',
            'error'
          )
        }
      })
    }

  /**
   * Logout User
   */

   logout(){
    this.authService.logout();
   }
}
