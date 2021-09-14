import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  signupForm: FormGroup;
  id = 2;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+')]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(15),Validators.pattern('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{6,}).*$')]],
      role: ['', [Validators.required]],
    });
  }

  get username(): any { return this.signupForm.get('username'); }
  get password(): any { return this.signupForm.get('password'); }
  get name():any {return this.signupForm.get('name');}
  get role():any {return this.signupForm.get('role');}

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
   * Add User Method
   */

   signup(){
    
    if (this.signupForm.valid) {
      const formData = {
        'id': Date.now(),
        'name': this.signupForm.get('name').value,
        'username': this.signupForm.get('username').value,
        'password': this.signupForm.get('password').value,
        'role': this.signupForm.get('role').value
      }
      this.authService.signup(formData).subscribe(d=>{

        this.authService.toastSuccess('User added successfully!');
        this.router.navigate(['/admin-dashboard']);

      },err => {
        console.log(err);
        this.authService.toastError('Failed!');
      });

    }else{
      // validate all form fields
      this.validateAllFormFields(this.signupForm); //{7}
    }

  }
}
