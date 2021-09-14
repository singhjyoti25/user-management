import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editForm: FormGroup;
  userList:any={};
  userName:string;
  Name:string;
  Role:string;
  userId:any;

  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get("userId");
      this.getUser(this.userId);

    });

    
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

  /**
   * Get User by userId
   * @param userId 
   */
  getUser(userId){
    this.authService.getUser(userId).subscribe(d=>{
      this.userList = d;
      if(this.userList){

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
      const id = this.userId;
      const formData = {
        'name': this.editForm.get('name').value,
        'role': this.editForm.get('role').value
      }

      this.authService.editUser(formData,id).subscribe(d=>{
        this.authService.toastSuccess('User Detail Updated Successfully!');
        this.router.navigate(['/admin-dashboard']);

      },err => {
        console.log(err);
        this.authService.toastError('Updation Failed!');
      });

    }else{
      // validate all form fields
      this.validateAllFormFields(this.editForm); //{7}
    }
  }

}
