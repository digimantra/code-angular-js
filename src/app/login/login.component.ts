import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { userService } from '../services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMsg: string = '';
  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: userService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      emailid: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      this.errorMsg = 'Please fill in all required fields';
      return;
    }

    this.loader = true;
    const loginData = this.form.value;

    this.service.postMethod('adminlogin', JSON.stringify(loginData))
      .subscribe({
        next: (response) => {
          if (!response.error) {
            console.log("finally", response);
            localStorage.setItem('loginId', response.data.UserId);
            localStorage.setItem('access_token', response.data.token);
            this.router.navigate(['/dashboard/users']);
          } else {
            this.errorMsg = response.message;
          }
          this.loader = false;
        },
        error: (error) => {
          this.errorMsg = 'An error occurred during login. Please try again later.';
          console.error(error);
          this.loader = false;
        }
      });
  }
}
