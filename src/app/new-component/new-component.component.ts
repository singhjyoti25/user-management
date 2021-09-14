import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-new-component',
  templateUrl: './new-component.component.html',
  styleUrls: ['./new-component.component.css']
})
export class NewComponentComponent implements OnInit {
  editForm: FormGroup;
  userList:any={};
  userName:string;
  Name:string;
  Role:string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      username: [''],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+')]],
      role: ['', [Validators.required]],
    });

    this.getUser();
  }

  get username(): any { return this.editForm.get('username'); }
  get name():any {return this.editForm.get('name');}
  get role():any {return this.editForm.get('role');}

  /**
   * 
   * validate all form fields
   */
   validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);           
      }
    });
  }

  getUser(){
    const id = this.authService.getCurrentUserId();
    this.authService.getUser(id).subscribe(d=>{
      this.userList = d;
      if(this.userList){
        this.userName = this.userList.username;
        this.Name = this.userList.name;
        this.Role = this.userList.role;

        this.editForm.patchValue({
          'name':this.userList.name,
          'username':this.userList.username,
          'role':this.userList.role
        });
      }
    },err => {
      console.log(err);
      this.authService.toastError('Failed!');
    });
  }

  /**
   * Edit Detail Method
   */

   editDetail(){
    
    if (this.editForm.valid) {
      const id = this.authService.getCurrentUserId();
      const formData = {
        'name': this.editForm.get('name').value,
        'role': this.editForm.get('role').value
      }

      this.authService.editUser(formData,id).subscribe(d=>{

        //console.log(d);

        this.authService.toastSuccess('User Detail Updated Successfully!');
        localStorage.setItem(environment.dataStore.userData, JSON.stringify(d));
        this.router.navigate(['/user-detail']);

      },err => {
        console.log(err);
        this.authService.toastError('Updation Failed!');
      });

    }else{
      // validate all form fields
      this.validateAllFormFields(this.editForm); //{7}
    }
  }
  
  /**
 * Logout User
 */

  logout(){
  this.authService.logout();
  }
}
