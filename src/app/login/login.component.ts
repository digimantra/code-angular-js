import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Service } from "../services/service.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  loginData = {
    emailid: "",
    password: ""
  }
  loginId: any;
  errorMsg: string;
  loader = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private Service: Service,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }
  //login
  login() { 
    this.loader = true;
    let data = {
      "username": this.loginData.emailid,
      "password": this.loginData.password,
    }
    this.Service.postMethod('adminlogin', JSON.stringify(data))
      .subscribe((response => {
        if (response.error == false) {
          console.log("finally",response);
          this.loginId = response.data.UserId;
          localStorage.setItem('loginId', this.loginId);
          localStorage.setItem('access_token', response.data.token);
          this.loader = false;
          this.router.navigate(['/dashboard/users']);
        }
        else {
          this.loader = false;
          this.errorMsg = response.message;
        }
      }),
        (error) => {
          this.loader = false;
          console.log(error);
        }
      )

  }

}