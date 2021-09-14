import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    /**
     * If user is logged In then redirect to user detail page
     */
    if(this.authService.isLoggedIn()==true){
      if(this.authService.getUserRole() == 'admin'){
        this.router.navigate(['/admin-dashboard']);
      }else{
        this.router.navigate(['/user-detail']);
      } 
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(15),Validators.pattern('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{6,}).*$')]]
    });
  }

  get username(): any { return this.loginForm.get('username'); }
  get password(): any { return this.loginForm.get('password'); }

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
   * Login method 
   */
  login(){
    
    if (this.loginForm.valid) {
      //$('.loaderBlock').show();

      this.authService.login().subscribe(d=>{
        //$('.loaderBlock').hide();

        const username = this.loginForm.get('username').value;
        const password = this.loginForm.get('password').value;

        const user = d.find(x => x.username === username && x.password === password);
        if (!user) this.authService.toastError('Username or password is incorrect');
        else{
          this.authService.toastSuccess('Authentication Success!');
          const userData = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          }
          
          localStorage.setItem(environment.dataStore.userData, JSON.stringify(userData)); 
          if(userData.role == 'admin'){
            this.router.navigate(['/admin-dashboard']);
          }else{
            this.router.navigate(['/user-detail']);
          } 
        }

      },err => {
        console.log(err);
        this.authService.toastError('Authentication Failed!');
      });

    }else{
      // validate all form fields
      this.validateAllFormFields(this.loginForm); //{7}
    }

  }
}
